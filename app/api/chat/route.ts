import Fuse from 'fuse.js'
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req: Request) {
    const { message } = await req.json()
    const msg = message.toLowerCase()

    // Ambil data produk dan FAQ dari database
    const products = await prisma.product.findMany({
        select: { name: true, price: true },
    })
    const faqs = await prisma.faq.findMany({
        select: { question: true, answer: true },
    })

    // =============================
    // 1) Intent: List Produk
    // =============================
    if (/list.*produk|produk.*apa|apa.*produk|jenis.*produk/i.test(msg)) {
        const list = products
            .map((p) => `• ${p.name} - Rp ${p.price.toLocaleString('id-ID')}`)
            .join('\n')
        return NextResponse.json({
            reply: `Berikut daftar produk kami:\n\n${list}`,
        })
    }

    // =============================
    // 2) Intent: Harga Produk dengan Fuse.js
    // =============================
    const fuseProduct = new Fuse(products, {
        keys: ['name'],
        threshold: 0.4,
    })

    const productResult = fuseProduct.search(msg)

    if (productResult.length > 0) {
        const product = productResult[0].item

        const qtyMatch = msg.match(/(\d+)\s*(pcs|unit|buah)?/i)
        const quantity = qtyMatch ? parseInt(qtyMatch[1], 10) : 1

        const totalPrice = product.price * quantity

        return NextResponse.json({
            reply:
                quantity > 1
                    ? `Harga *${product.name}* untuk ${quantity} pcs adalah Rp${totalPrice.toLocaleString('id-ID')}.`
                    : `Harga *${product.name}* adalah Rp${product.price.toLocaleString('id-ID')}.`,
        })
    }

    // =============================
    // 3) Fuzzy Matching FAQ (Fuse.js)
    // =============================
    const fuseFAQ = new Fuse(faqs, {
        keys: ['question', 'answer'],
        threshold: 0.3,
    })

    const faqResult = fuseFAQ.search(msg)
    if (faqResult.length > 0) {
        return NextResponse.json({ reply: faqResult[0].item.answer })
    }

    // =============================
    // 4) Fallback jika tidak ditemukan
    // =============================
    return NextResponse.json({
        reply: 'Maaf, saya belum dapat menemukan jawaban. Silakan hubungi admin melalui WhatsApp untuk informasi lebih lanjut.',
    })
}
