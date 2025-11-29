import Fuse from 'fuse.js'
import { unstable_cache } from 'next/cache' // Fitur caching Next.js
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// Caching Data (Agar tidak query DB terus menerus)
const getCachedData = unstable_cache(
    async () => {
        const [products, faqs] = await Promise.all([
            prisma.product.findMany({
                select: {
                    id: true,
                    name: true,
                    price: true,
                    description: true,
                    category: true,
                },
            }),
            prisma.faq.findMany({ select: { question: true, answer: true } }),
        ])
        return { products, faqs }
    },
    ['bot-data'],
    { revalidate: 3600 },
)

/** Util: map kata angka Indonesia -> number */
const NUM_WORDS: Record<string, number> = {
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
}

/** Sinonim canonicalization */
const SYNONYMS: Record<string, string> = {
    barang: 'produk',
    item: 'produk',
    produk: 'produk',
    harga: 'harga',
    biaya: 'harga',
}

/** Stopwords sederhana untuk dibersihkan dari query */
const STOPWORDS = [
    'apa',
    'saja',
    'ada',
    'yang',
    'untuk',
    'berapa',
    'berapa?',
    'berapa:',
    'harga',
    'tolong',
    'saya',
    'ingin',
    'cari',
    'lihat',
    'daftar',
]

function normalizeText(text: string) {
    let t = text.toLowerCase().replace(/[?!.,:;()"'`]/g, ' ')
    // ganti sinonim ke canonical (kata tunggal)
    for (const [k, v] of Object.entries(SYNONYMS)) {
        const re = new RegExp(`\\b${k}\\b`, 'gi')
        t = t.replace(re, v)
    }
    // hapus stopwords (menjaga kata penting untuk pencarian)
    const tokens = t
        .split(/\s+/)
        .map((s) => s.trim())
        .filter(Boolean)
        .filter((tok) => !STOPWORDS.includes(tok))
    return tokens.join(' ')
}

function parseQuantity(text: string) {
    // cari angka digit
    const digitMatch = text.match(/(\d+)\s*(pcs|unit|buah)?/i)
    if (digitMatch) return parseInt(digitMatch[1], 10)
    // cari kata angka sederhana (satu, dua, tiga...)
    for (const [word, num] of Object.entries(NUM_WORDS)) {
        const re = new RegExp(`\\b${word}\\b`, 'i')
        if (re.test(text)) return num
    }
    return 1
}

export async function POST(req: Request) {
    const { message } = await req.json()
    const cleanOriginal = (message || '').toString().trim()
    const clean = cleanOriginal.toLowerCase().replace(/\s+/g, ' ')
    const normalized = normalizeText(clean)

    // Ambil data dari cache
    const { products, faqs } = await getCachedData()

    // 1) Greeting sederhana
    if (/^(halo|hai|hi|selamat|pagi|siang|sore|malam)\b/.test(clean)) {
        return NextResponse.json({
            reply: 'Halo! Ada yang bisa saya bantu terkait produk, harga, atau info lainnya?',
        })
    }

    // 2) Intent: List Produk (lebih fleksibel, termasuk "ada produk apa saja", "barang apa saja", "list item")
    if (
        /(ada|apa).*(produk|barang|item).*(apa saja|saja)|^(produk|barang|item).*(apa saja|saja)|\b(list|daftar|katalog|menu)\b.*(produk|barang|item)|\b(ada produk apa saja|list produk)\b/i.test(
            clean,
        )
    ) {
        // Jika user menyebut kategori (misal "ada produk kaos apa saja"), coba filter
        const categoryToken = products.some((p) => p.category)
            ? products
                  .map((p) => p.category)
                  .find(
                      (c) =>
                          c &&
                          new RegExp(
                              `\\b${escapeRegExp(String(c))}\\b`,
                              'i',
                          ).test(clean),
                  )
            : null

        const filtered = categoryToken
            ? products.filter(
                  (p) =>
                      p.category &&
                      p.category.name.toLowerCase() ===
                          categoryToken.name.toLowerCase(),
              )
            : products

        const list = filtered
            .slice(0, 10)
            .map(
                (p) =>
                    `• ${p.name} — Rp${Number(p.price).toLocaleString('id-ID')}${p.category ? ` (${p.category})` : ''}`,
            )
            .join('\n')

        const moreNote =
            filtered.length > 10
                ? `\n\nMenampilkan 10 dari ${filtered.length} produk. Sebutkan kategori atau nama produk untuk detail.`
                : ''

        return NextResponse.json({
            reply: `Berikut beberapa produk kami:\n\n${list}${moreNote}`,
        })
    }

    // 3) Siapkan data untuk Fuse: tambahkan aliases & gabungkan description
    const productsForSearch = products.map((p) => {
        // aliases basic: nama tanpa stopwords, kata2 terbalik, kata2 potongan
        const nameTokens = p.name
            .toLowerCase()
            .split(/\s+/)
            .filter((t) => t.length > 1)
        const aliases = [
            p.name,
            nameTokens.join(' '),
            nameTokens
                .slice(0, 2)
                .join(' '), // potongan 2 kata pertama
            p.category || '',
        ]
        return {
            ...p,
            aliases: Array.from(new Set(aliases)).filter(Boolean),
            combined: `${p.name} ${p.description || ''} ${p.category || ''}`,
        }
    })

    const fuseProduct = new Fuse(productsForSearch, {
        keys: [
            { name: 'name', weight: 0.6 },
            { name: 'combined', weight: 0.25 },
            { name: 'aliases', weight: 0.15 },
        ],
        threshold: 0.35,
        includeScore: true,
    })

    // 4) Jika user menanyakan harga eksplisit seperti "berapa harga ..." atau mengandung kata 'harga'
    const isPriceQuestion = /\b(harga|berapa|biaya|estimasi)\b/.test(clean)

    // Lakukan pencarian menggunakan normalized text (tanpa stopwords)
    const queryForSearch = normalized || clean
    const productResults = queryForSearch.trim()
        ? fuseProduct.search(queryForSearch)
        : []

    if (productResults.length > 0) {
        const best = productResults[0]
        // Jika confidence baik (score kecil) atau user eksplisit tanya harga -> tampilkan harga
        if ((best.score ?? 1) < 0.4 || isPriceQuestion) {
            const product = best.item
            const qty = parseQuantity(clean)
            const total = Number(product.price) * qty
            // Jika hasilnya ambiguous (banyak hasil serupa) dan top2 skor hampir sama, tawarkan opsi
            if (
                productResults.length > 1 &&
                productResults[1].score &&
                Math.abs((productResults[1].score ?? 1) - (best.score ?? 1)) <
                    0.07
            ) {
                // Top 3 suggestions
                const suggestions = productResults
                    .slice(0, 3)
                    .map(
                        (r) =>
                            `• ${r.item.name} — Rp${Number(r.item.price).toLocaleString('id-ID')}`,
                    )
                    .join('\n')
                return NextResponse.json({
                    reply: `Sepertinya ada beberapa produk yang mirip:\n${suggestions}\n\nMau harga detail untuk produk yang mana? Ketik nama produknya.`,
                })
            }

            return NextResponse.json({
                reply:
                    qty > 1
                        ? `Estimasi harga *${product.name}* (${qty} unit): Rp${total.toLocaleString('id-ID')}`
                        : `Harga *${product.name}* saat ini Rp${Number(product.price).toLocaleString('id-ID')}`,
            })
        } else {
            // Jika skor kurang meyakinkan dan user tidak eksplisit tanya harga -> kasih suggestions
            const suggestions = productResults
                .slice(0, 3)
                .map((r) => `• ${r.item.name}`)
                .join('\n')
            return NextResponse.json({
                reply: `Saya menemukan beberapa kandidat terkait yang mungkin Anda maksud:\n${suggestions}\n\nKetik nama produk untuk melihat harga atau detail.`,
            })
        }
    }

    // 5) Pencarian FAQ (Weighted Keys)
    const fuseFAQ = new Fuse(faqs, {
        keys: [
            { name: 'question', weight: 0.7 },
            { name: 'answer', weight: 0.3 },
        ],
        threshold: 0.4,
    })
    const faqResults = fuseFAQ.search(normalized || clean)
    if (faqResults.length > 0) {
        return NextResponse.json({ reply: faqResults[0].item.answer })
    }

    // 6) Jika masih belum paham -> bantu dengan contoh query atau suggest
    return NextResponse.json({
        reply: 'Maaf, saya kurang paham. Coba ketik contoh: "Ada produk apa saja?", "Berapa harga [nama produk]?", atau ketik kategori (mis. "kaos") untuk melihat produk terkait.',
    })
}

/** kecil helper: escape regex */
function escapeRegExp(string: string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
