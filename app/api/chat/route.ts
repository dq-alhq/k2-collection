import Fuse from 'fuse.js'
import { unstable_cache } from 'next/cache'
import { NextResponse } from 'next/server'
import { Stemmer } from 'sastrawijs'
import { SYNONYMS } from '@/app/api/chat/synonim'
import { siteConfig } from '@/config/site'
import prisma from '@/lib/prisma'
import { parseWhatsapp } from '@/lib/utils'

// NOTE: This file is a drop-in replacement for your existing route.ts
// It improves intent detection, alias generation, Fuse weighting, contextual
// re-ranking, ambiguity handling, and provides hooks for session memory.

const stemmer = new Stemmer()

// ----------------------------- Configuration -----------------------------
const CACHE_KEY = ['bot-data']
const CACHE_REVALIDATE = 3600 // seconds (1 hour)

const DEFAULT_FUSE_THRESHOLD = 0.38
const PRICE_INTENT_THRESHOLD = 0.45 // looser threshold for price intent

// Simple in-memory session store for demo only. Replace with Redis or DB in prod.
// Serverless platforms may not keep this memory between invocations.
const sessionStore = new Map<
    string,
    { lastProductId?: string; lastContext?: string }
>()

// ----------------------------- Cached data -------------------------------
const getCachedData = unstable_cache(
    async () => {
        const [products, faqs] = await Promise.all([
            prisma.product.findMany({
                select: {
                    id: true,
                    name: true,
                    price: true,
                    description: true,
                    category: { select: { name: true } },
                },
            }),
            prisma.faq.findMany({ select: { question: true, answer: true } }),
        ])

        return { products, faqs }
    },
    CACHE_KEY,
    { revalidate: CACHE_REVALIDATE },
)

// ----------------------------- Utilities --------------------------------
function escapeRegExp(string: string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

const STOPWORDS = new Set([
    'apa',
    'saja',
    'ada',
    'yang',
    'untuk',
    'tolong',
    'saya',
    'ingin',
    'cari',
    'lihat',
    'daftar',
    'berapa',
    'siapa',
    'dimana',
    'di',
    'ke',
    'yg',
    'itu',
    'nya',
    'mau',
    'bisa',
    'minta',
    'kasih',
    'dong',
])

function normalizeText(text: string) {
    let t = (text || '').toLowerCase().replace(/[?!.,:;()"'`]/g, ' ')
    // apply synonym canonicalization first (so stemmer sees canonical tokens)
    for (const [k, v] of Object.entries(SYNONYMS || {})) {
        const re = new RegExp(`\\b${escapeRegExp(k)}\\b`, 'gi')
        t = t.replace(re, v)
    }

    // simple remove multiple spaces
    t = t.replace(/\s+/g, ' ').trim()

    // perform stemming (Sastrawi) and remove stopwords
    const tokens = t
        .split(' ')
        .map((s) => stemmer.stem(s.trim()))
        .filter(Boolean)
        .filter((tok) => !STOPWORDS.has(tok))

    return tokens.join(' ')
}

// Improved quantity parser: supports digits, words (nol..sebelas, puluhan), and 'pack' synonyms
const NUM_WORDS: Record<string, number> = {
    nol: 0,
    satu: 1,
    dua: 2,
    tiga: 3,
    empat: 4,
    lima: 5,
    enam: 6,
    tujuh: 7,
    delapan: 8,
    sembilan: 9,
    sepuluh: 10,
    sebelas: 11,
}

function parseQuantity(text: string) {
    if (!text) return 1
    // numeric captures like "10", "10 pcs", "10x"
    const digitMatch = text.match(/(\d+)\s*(pcs|unit|buah|kg|gram|x)?/i)
    if (digitMatch) return Number(digitMatch[1])

    // words like 'sepuluh', 'dua puluh' (basic handling)
    const tensMatch = text.match(/(dua puluh|tiga puluh|empat puluh)/i)
    if (tensMatch) {
        const map: Record<string, number> = {
            'dua puluh': 20,
            'tiga puluh': 30,
            'empat puluh': 40,
        }
        return map[tensMatch[1].toLowerCase()] || 1
    }

    for (const [w, n] of Object.entries(NUM_WORDS)) {
        if (new RegExp(`\\b${escapeRegExp(w)}\\b`, 'i').test(text)) return n
    }

    return 1
}

// Light intent detector (returns probabilities / booleans)
function detectIntent(text: string) {
    const price = /\b(harga|berapa|biaya|estimasi|total|ongkos|tarif)\b/i.test(
        text,
    )
    const list =
        /\b(list|daftar|katalog|menu|produk apa|barang apa|ada produk|koleksi)\b/i.test(
            text,
        )
    const category = /\b(kategori|jenis|tipe|macam)\b/i.test(text)
    const availability = /\b(stok|tersedia|ada|habis|ready)\b/i.test(text)
    const faq =
        /\b(bagaimana|cara|apa itu|apa saja|kenapa|kapan|lokasi|alamat|toko)\b/i.test(
            text,
        )
    const recommendation =
        /\b(rekomendasi|saran|bagus|terbaik|favorit|laku|laris)\b/i.test(text)

    return { price, list, category, availability, faq, recommendation }
}

// Extract attributes like price range, specific colors, or sorting requests
function extractAttributes(text: string) {
    const t = text.toLowerCase()

    // Price range
    let maxPrice = Infinity
    const minPrice = 0

    const underMatch = t.match(
        /(dibawah|kurang dari|max|maksimal|bawah)\s*(\d+|sejut|goceng|ceban)/i,
    )
    if (underMatch) {
        const val = parseInt(underMatch[2].replace(/\D/g, '')) // simplistic
        if (underMatch[2].includes('ribu') || underMatch[2].includes('rb'))
            maxPrice = val * 1000
        else if (underMatch[2] === 'sejut') maxPrice = 1000000
        else if (underMatch[2] === 'goceng') maxPrice = 5000
        else if (underMatch[2] === 'ceban') maxPrice = 10000
        else maxPrice = val

        // Handle "100rb" case if regex didn't catch suffix in group 2
        if (t.includes('rb') || t.includes('ribu')) {
            const num = t.match(/(\d+)\s*(rb|ribu)/)
            if (num) maxPrice = parseInt(num[1]) * 1000
        }
    }

    // Sorting
    let sort: 'asc' | 'desc' | null = null
    if (/\b(termurah|paling murah|murah)\b/i.test(t)) sort = 'asc'
    if (/\b(termahal|paling mahal|mahal|sultan)\b/i.test(t)) sort = 'desc'

    return { minPrice, maxPrice, sort }
}

// generate many aliases to make fuzzy match tolerant
function generateAliases(p: any) {
    const name = String(p.name || '').toLowerCase()
    const desc = String(p.description || '').toLowerCase()
    const cat = String(p.category?.name || '').toLowerCase()

    const tokens = name.split(/\s+/).filter(Boolean)
    const firstTwo = tokens.slice(0, 2).join(' ')
    const joined = tokens.join(' ')

    const simplePlurals = tokens.map((t) =>
        t.endsWith('s') ? t.slice(0, -1) : t + 's',
    )

    const aliasSet = new Set<string>([
        name,
        firstTwo,
        joined,
        cat,
        desc,
        ...tokens,
        ...simplePlurals,
    ])

    // add stemmed variants
    aliasSet.add(stemmer.stem(name))
    aliasSet.add(stemmer.stem(joined))

    // include synonyms if present
    for (const tok of Array.from(aliasSet)) {
        if (SYNONYMS && SYNONYMS[tok]) aliasSet.add(SYNONYMS[tok])
    }

    return Array.from(aliasSet).filter(Boolean)
}

// contextual re-ranking: gives extra weight to token matches like 'gsm', 'a4', color, size
function contextScore(product: any, text: string) {
    const t = text.toLowerCase()
    const name = String(product.name || '').toLowerCase()
    const cat = String(product.category?.name || '').toLowerCase()
    const desc = String(product.description || '').toLowerCase()
    let score = 0

    if (t.includes(cat) && cat) score += 2
    if (t.includes(name)) score += 3

    // domain-specific tokens: extend as needed
    const detailTokens = [
        'gsm',
        'a4',
        'a3',
        '80',
        '100',
        'hitam',
        'warna',
        'putih',
        'paket',
        'merah',
        'biru',
        'hijau',
        'kuning',
        'abu',
        'navy',
        'maroon',
        'coklat',
    ]
    for (const dt of detailTokens) {
        if (t.includes(dt) && (name.includes(dt) || desc.includes(dt)))
            score += 1
    }

    return score
}

// ----------------------------- Main handler ------------------------------
function normalizeQuery(q) {
    q = q.toLowerCase().trim()
    const map: Record<string, string> = {
        'kaos oblong katun premium': 'kaos oblong katun premium',
        'kaos oblong': 'kaos oblong',
        oblong: 'kaos oblong',
        kaos: 'kaos oblong',
        'katun premium': 'katun premium',
        premium: 'premium',
    }
    const sorted = Object.keys(map).sort((a, b) => b.length - a.length)
    for (const key of sorted) {
        const regex = new RegExp(`\\b${key}\\b`, 'g')
        q = q.replace(regex, map[key])
    }
    return q
}

export async function POST(req: Request) {
    try {
        const { message, sessionId } = await req.json()
        const cleanOriginal = (message || '').toString().trim()
        const clean = cleanOriginal.toLowerCase().replace(/\s+/g, ' ')
        const normalized = normalizeText(normalizeQuery(clean))

        const { products, faqs } = await getCachedData()

        // quick greeting
        if (
            /^(halo|hai|hi|selamat|pagi|siang|sore|malam|assalamualaikum|tes|ping)\b/i.test(
                clean,
            )
        ) {
            return NextResponse.json({
                reply: 'Halo! Ada yang bisa saya bantu? Silakan tanya tentang produk, harga, atau stok kami.',
                suggestions: [
                    'Lihat katalog produk',
                    'Cara order',
                    'Promo hari ini',
                    'Lokasi toko',
                ],
            })
        }

        const intent = detectIntent(clean)
        const attributes = extractAttributes(clean)

        // Intent: list products explicitly
        if (intent.list) {
            const categories = Array.from(
                new Set(products.map((p) => p.category?.name).filter(Boolean)),
            )
            // If user asks for specific category list e.g. "list kaos"
            const matchedCat = categories.find((c) =>
                clean.includes(c?.toLowerCase() || ''),
            )

            let filtered = products
            if (matchedCat) {
                filtered = products.filter(
                    (p) =>
                        p.category?.name?.toLowerCase() ===
                        matchedCat.toLowerCase(),
                )
            }

            const list = filtered
                .slice(0, 15)
                .map(
                    (p) =>
                        `• ${p.name} — Rp${Number(p.price).toLocaleString('id-ID')}`,
                )
                .join('\n')

            const intro = matchedCat
                ? `Berikut daftar ${matchedCat} kami:`
                : `Berikut beberapa produk kami (Kategori: ${categories.join(', ')}):`

            const suggestions = matchedCat
                ? ['Lihat kategori lain', 'Cara order', 'Termurah']
                : categories.map((c) => `Lihat ${c}`).concat(['Termurah'])

            return NextResponse.json({
                reply: `${intro}\n\n${list}\n\nKetik nama produk untuk detail lebih lanjut.`,
                suggestions: suggestions.slice(0, 4),
            })
        }

        // If intent is FAQ, try FAQ search first
        if (intent.faq) {
            const fuseFAQ = new Fuse(faqs, {
                keys: [
                    { name: 'question', weight: 0.7 },
                    { name: 'answer', weight: 0.3 },
                ],
                threshold: 0.55, // slightly looser
                includeScore: true,
            })
            const faqResults = fuseFAQ.search(normalized || clean)
            if (faqResults.length > 0) {
                return NextResponse.json({
                    reply: faqResults[0].item.answer,
                    suggestions: [
                        'Lihat katalog',
                        'Hubungi admin',
                        'Kembali ke menu utama',
                    ],
                })
            }
        }

        // Prepare products for Fuse
        const productsForSearch = products.map((p: any) => {
            const name = String(p.name || '')
            const desc = String(p.description || '')
            const category = String(p.category?.name || '')

            return {
                ...p,
                name,
                desc,
                category,
                aliases: generateAliases(p),
                combinedStem: stemmer.stem(`${name} ${desc} ${category}`),
            }
        })

        // Build Fuse with dynamic weighting based on intent
        const fuseOptions = {
            includeScore: true,
            threshold: intent.price
                ? PRICE_INTENT_THRESHOLD
                : DEFAULT_FUSE_THRESHOLD,
            keys: intent.price
                ? [
                      { name: 'name', weight: 0.7 },
                      { name: 'aliases', weight: 0.2 },
                      { name: 'combinedStem', weight: 0.1 },
                  ]
                : [
                      { name: 'combinedStem', weight: 0.4 },
                      { name: 'name', weight: 0.3 },
                      { name: 'aliases', weight: 0.2 },
                      { name: 'desc', weight: 0.1 },
                  ],
        }

        const fuse = new Fuse(productsForSearch, fuseOptions as any)

        // Decide query text: prefer normalized but fallback to original cleaned
        const queryForSearch = normalized || clean

        let productResults = queryForSearch.trim()
            ? fuse.search(queryForSearch)
            : []

        // If recommendation intent and no specific search results, use all products to pick from
        if (intent.recommendation && productResults.length === 0) {
            // Mock a search result structure for all products so we can re-rank them
            productResults = productsForSearch.map((p, i) => ({
                item: p,
                score: 0.1,
                refIndex: i,
            }))
        }

        // Apply Attribute Filters (Price)
        if (attributes.maxPrice < Infinity) {
            productResults = productResults.filter(
                (r: any) => r.item.price <= attributes.maxPrice,
            )
        }

        // Apply Sorting
        if (attributes.sort) {
            productResults.sort((a: any, b: any) => {
                if (attributes.sort === 'asc')
                    return a.item.price - b.item.price
                return b.item.price - a.item.price
            })
        }

        // If found some candidate products
        if (productResults.length > 0) {
            // contextual re-ranking
            const reRanked = productResults
                .map((r: any) => ({
                    ...r,
                    ctxScore: contextScore(r.item, clean),
                }))
                .sort((a: any, b: any) => {
                    // If explicit sort requested, respect it first
                    if (attributes.sort) return 0

                    if ((b.ctxScore || 0) - (a.ctxScore || 0) !== 0)
                        return (b.ctxScore || 0) - (a.ctxScore || 0)
                    // lower Fuse score is better
                    return (a.score ?? 1) - (b.score ?? 1)
                })

            const best = reRanked[0]
            const bestItem = best.item

            // Save last product to session (demo). Use sessionId provided by client.
            if (sessionId) {
                const s = sessionStore.get(sessionId) || {}
                s.lastProductId = String(bestItem.id)
                sessionStore.set(sessionId, s)
            }

            // ambiguity handling: if top2 scores are close, ask clarification with better UX
            // Skip ambiguity check if we have a strong context match or explicit sort
            if (
                reRanked.length > 1 &&
                !attributes.sort &&
                (best.ctxScore || 0) < 2 &&
                !intent.recommendation // Don't ask for clarification if asking for recommendation
            ) {
                const top1Score = reRanked[0].score ?? 1
                const top2Score = reRanked[1].score ?? 1
                if (Math.abs(top2Score - top1Score) < 0.08) {
                    const suggestions = reRanked
                        .slice(0, 4)
                        .map(
                            (r: any) =>
                                `• ${r.item.name} — Rp${Number(r.item.price).toLocaleString('id-ID')}`,
                        )
                        .join('\n')

                    const suggestionButtons = reRanked
                        .slice(0, 3)
                        .map((r: any) => `Harga ${r.item.name}`)

                    return NextResponse.json({
                        reply: `Saya menemukan beberapa produk yang mirip:\n${suggestions}\n\nBisa lebih spesifik? Atau pilih salah satu.`,
                        suggestions: suggestionButtons,
                    })
                }
            }

            // If intent is price or user included price words -> show price and quantity support
            if (intent.price || attributes.sort) {
                const qty = parseQuantity(clean)
                const total = Number(bestItem.price) * qty
                const priceText =
                    qty > 1
                        ? `Estimasi harga *${bestItem.name}* (${qty} unit): Rp${total.toLocaleString('id-ID')}`
                        : `Harga *${bestItem.name}* saat ini Rp${Number(bestItem.price).toLocaleString('id-ID')}`

                return NextResponse.json({
                    reply: priceText,
                    suggestions: [
                        `Beli ${bestItem.name}`,
                        'Lihat produk lain',
                        'Cek ongkir',
                    ],
                })
            }

            // If intent is recommendation or just browsing
            if (intent.recommendation) {
                const suggestions = reRanked
                    .slice(0, 5)
                    .map(
                        (r: any) =>
                            `• ${r.item.name} (Rp${Number(r.item.price).toLocaleString('id-ID')})`,
                    )
                    .join('\n')

                const suggestionButtons = reRanked
                    .slice(0, 3)
                    .map((r: any) => `Harga ${r.item.name}`)

                return NextResponse.json({
                    reply: `Rekomendasi produk untuk Anda:\n${suggestions}\n\nKetik nama produk untuk detail.`,
                    suggestions: suggestionButtons,
                })
            }

            // If not explicit price intent, but confidence is good, provide short product summary + hint
            if ((best.score ?? 1) < 0.5 || (best.ctxScore || 0) > 0) {
                const summary = `${bestItem.name} — Rp${Number(bestItem.price).toLocaleString('id-ID')}${bestItem.category ? ` (${bestItem.category})` : ''}\n${bestItem.desc ? `${bestItem.desc.slice(0, 200)}${bestItem.desc.length > 200 ? '...' : ''}` : ''}`
                return NextResponse.json({
                    reply: `${summary}\n\nKetik 'harga ${bestItem.name}' untuk melihat total atau sebutkan jumlah (contoh: '10 ${bestItem.name}')`,
                    suggestions: [
                        `Harga ${bestItem.name}`,
                        `10 ${bestItem.name}`,
                        'Produk lain',
                    ],
                })
            }

            // fallback: present candidates
            const suggestions = reRanked
                .slice(0, 3)
                .map((r: any) => `• ${r.item.name}`)
                .join('\n')

            const suggestionButtons = reRanked
                .slice(0, 3)
                .map((r: any) => `Harga ${r.item.name}`)

            return NextResponse.json({
                reply: `Mungkin ini yang Anda cari:\n${suggestions}\n\nKetik nama produk untuk melihat harga atau detail.`,
                suggestions: suggestionButtons,
            })
        }

        // If no product matched, try FAQ search (fallback if intent wasn't explicit)
        if (!intent.faq) {
            const fuseFAQ = new Fuse(faqs, {
                keys: [
                    { name: 'question', weight: 0.7 },
                    { name: 'answer', weight: 0.3 },
                ],
                threshold: 0.45,
                includeScore: true,
            })
            const faqResults = fuseFAQ.search(normalized || clean)
            if (faqResults.length > 0 && (faqResults[0].score ?? 1) < 0.6) {
                return NextResponse.json({
                    reply: faqResults[0].item.answer,
                    suggestions: ['Lihat katalog', 'Hubungi admin'],
                })
            }
        }

        // fallback category match by direct token
        const categories = Array.from(
            new Set(
                products
                    .map((p) => String(p.category?.name || '').toLowerCase())
                    .filter(Boolean),
            ),
        )
        const matchedCategory = categories.find((c) => clean.includes(c))
        if (matchedCategory) {
            const filtered = products.filter(
                (p) =>
                    String(p.category?.name || '').toLowerCase() ===
                    matchedCategory,
            )
            const list = filtered
                .slice(0, 10)
                .map(
                    (p) =>
                        `• ${p.name} — Rp${Number(p.price).toLocaleString('id-ID')}`,
                )
                .join('\n')
            return NextResponse.json({
                reply: `Ini produk kategori *${matchedCategory}*:\n\n${list}`,
                suggestions: filtered
                    .slice(0, 3)
                    .map((p) => `Harga ${p.name}`)
                    .concat(['Lihat kategori lain']),
            })
        }

        // If user refers to last product in session (e.g. "berapa total kalau 10?")
        if (sessionId) {
            const s = sessionStore.get(sessionId)
            if (s?.lastProductId) {
                const last = products.find(
                    (p) => String(p.id) === s.lastProductId,
                )
                if (last && /\b(berapa|total|estimasi|harga)\b/i.test(clean)) {
                    const qty = parseQuantity(clean)
                    const total = Number(last.price) * qty
                    return NextResponse.json({
                        reply: `Estimasi harga *${last.name}* (${qty} unit): Rp${total.toLocaleString('id-ID')}`,
                        suggestions: [
                            `Beli ${last.name}`,
                            'Cek ongkir',
                            'Produk lain',
                        ],
                    })
                }
            }
        }

        // Final fallback: helpful examples
        return NextResponse.json({
            reply: `Maaf, saya kurang paham. Contoh perintah yang bisa dicoba:\n- "Ada produk apa saja?"\n- "Berapa harga [nama produk]?"\n Atau hubungi admin di [WhatsApp](https://wa.me/${parseWhatsapp(siteConfig.contact.phone)})`,
            suggestions: ['Lihat katalog', 'Cara order', 'Rekomendasi produk'],
        })
    } catch (err: any) {
        console.error('chat api error', err)
        return NextResponse.json(
            { reply: 'Terjadi kesalahan pada server. Coba lagi nanti.' },
            { status: 500 },
        )
    }
}
