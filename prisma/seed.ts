import prisma from '@/lib/prisma'

async function main() {
    try {
        console.log('Seeding user...')
        await prisma.user.create({
            data: {
                id: 'admin',
                name: 'Administrator',
                email: 'admin@gmail.com',
                emailVerified: true,
                accounts: {
                    create: {
                        id: 'admin',
                        accountId: 'admin',
                        providerId: 'credential',
                        accessToken: null,
                        refreshToken: null,
                        idToken: null,
                        accessTokenExpiresAt: null,
                        refreshTokenExpiresAt: null,
                        scope: null,
                        password:
                            'cf88dd76e78a98dce0c042b1f1ef5017:545168bc43fad0f55b01da206f5c7414a35b3206664eb9f4273c6d9e35c3afccc55ca67fa35f7bbd1709659126dd57d0292899ab76cf6ad78758e3d73fb5dbea',
                    },
                },
            },
        })
        console.log('User seeded successfully')
    } catch (error) {
        console.error(error)
    }

    // --- 1. SEED DATA CATEGORIES ---

    console.log('Seeding category...')

    const categories = [
        { name: 'Pakaian Pria', idAlias: 'C01' },
        { name: 'Pakaian Wanita', idAlias: 'C02' },
        { name: 'Pakaian Anak', idAlias: 'C03' },
        { name: 'Seragam & Pakaian Kerja', idAlias: 'C04' },
        { name: 'Pakaian Olahraga', idAlias: 'C05' },
        { name: 'Aksesori Kain', idAlias: 'C06' },
        { name: 'Perlengkapan Rumah Tangga', idAlias: 'C07' },
    ]

    const categoryMap = new Map<string, string>()

    for (const cat of categories) {
        const newCat = await prisma.category.create({
            data: {
                id: cat.idAlias,
                name: cat.name,
            },
        })
        console.log(
            `Created category with id: ${newCat.id} (Name: ${newCat.name})`,
        )
        categoryMap.set(cat.idAlias, newCat.id) // Simpan ID yang sebenarnya
    }

    console.log('Category seeded successfully')

    // --- 2. SEED DATA PRODUCTS ---

    console.log('Seeding product...')
    const products = [
        // --- Kategori C01: Pakaian Pria ---
        {
            name: 'Kaos Oblong Katun Premium',
            idAlias: 'C01',
            price: 65000,
            description:
                'Material Cotton Combed 30s, standar O-Neck, tersedia 5 warna dasar.',
        },
        {
            name: 'Kemeja Lengan Panjang Oxford',
            idAlias: 'C01',
            price: 150000,
            description:
                'Bahan kain Oxford, saku dada tunggal, cocok untuk semi-formal.',
        },
        {
            name: 'Celana Chino Slim Fit',
            idAlias: 'C01',
            price: 195000,
            description:
                'Bahan katun twill premium, potongan slim fit, ritsleting YKK.',
        },
        {
            name: 'Polo Shirt Pique 20s',
            idAlias: 'C01',
            price: 95000,
            description:
                'Polo shirt dengan kerah dan manset rajut, bahan CVC Pique 20s, nyaman dan menyerap keringat.',
        },
        {
            name: 'Jaket Hoodie Fleece Tebal',
            idAlias: 'C01',
            price: 185000,
            description:
                'Jaket bertudung (hoodie) dengan resleting, bahan Cotton Fleece 300gsm.',
        },

        // --- Kategori C02: Pakaian Wanita ---
        {
            name: 'Blus Wanita Crinkle Airflow',
            idAlias: 'C02',
            price: 120000,
            description:
                'Model loose fit, bahan crinkle yang nyaman dan tidak perlu disetrika.',
        },
        {
            name: 'Rok Plisket Midi',
            idAlias: 'C02',
            price: 110000,
            description:
                'Bahan Hyget Super, lipatan permanen, panjang sebetis.',
        },
        {
            name: 'Tunik Muslimah Basic',
            idAlias: 'C02',
            price: 175000,
            description:
                'Bahan Katun Toyobo, panjang menutupi lutut, busui friendly (ritsleting depan tersembunyi).',
        },
        {
            name: 'Dress Santai Katun Rayon',
            idAlias: 'C02',
            price: 140000,
            description:
                'Dress selutut model A-line, bahan Rayon Viscose adem, motif bunga minimalis.',
        },
        {
            name: 'Legging Spandek Standar',
            idAlias: 'C02',
            price: 55000,
            description:
                'Legging panjang bahan Spandek Lycra, elastis dan tidak menerawang.',
        },

        // --- Kategori C03: Pakaian Anak ---
        {
            name: 'Setelan Piyama Anak Motif',
            idAlias: 'C03',
            price: 85000,
            description:
                'Bahan kaos PE, motif kartun, ukuran S-L untuk usia 2-5 tahun.',
        },
        {
            name: 'Seragam Sekolah Dasar (SD)',
            idAlias: 'C03',
            price: 70000,
            description:
                'Kemeja Putih dan Rok/Celana Merah, bahan American Drill, jahitan kuat.',
        },
        {
            name: 'Jumper Bayi Newborn',
            idAlias: 'C03',
            price: 45000,
            description:
                'Baju terusan bayi (0-6 bulan), bahan Cotton Terry lembut, kancing jepret anti alergi.',
        },

        // --- Kategori C04: Seragam & Pakaian Kerja ---
        {
            name: 'Seragam Kantor Batik Printing',
            idAlias: 'C04',
            price: 180000,
            description:
                'Batik corporate motif Parang, bahan katun prima, custom logo bordir di saku.',
        },
        {
            name: 'Coverall Safety (Wearpack)',
            idAlias: 'C04',
            price: 250000,
            description:
                'Bahan American Drill tebal, reflektor 3M, tahan percikan api ringan, tersedia 3 kantong multifungsi.',
        },
        {
            name: 'Seragam Chef/Koki',
            idAlias: 'C04',
            price: 160000,
            description:
                'Baju koki lengan pendek, bahan Tropical berkualitas, kancing model double breasted.',
        },
        {
            name: 'Rompi Safety Jaring',
            idAlias: 'C04',
            price: 80000,
            description:
                'Rompi proyek bahan jaring poliester, dilengkapi dua garis reflektor tebal.',
        },

        // --- Kategori C05: Pakaian Olahraga ---
        {
            name: 'Jersey Sepak Bola Dry-Fit',
            idAlias: 'C05',
            price: 90000,
            description:
                'Bahan Dry-Fit, teknologi Quick Dry, bisa custom sablon nama/nomor.',
        },
        {
            name: 'Jaket Training Parasut',
            idAlias: 'C05',
            price: 165000,
            description:
                'Bahan Parasut Despo, tahan angin, lapis puring jala (mesh) di dalam.',
        },
        {
            name: 'Celana Jogger Sporty',
            idAlias: 'C05',
            price: 115000,
            description:
                'Celana training dengan karet di pergelangan kaki, bahan Baby Terry lembut.',
        },

        // --- Kategori C06: Aksesori Kain ---
        {
            name: 'Totebag Kanvas Polos',
            idAlias: 'C06',
            price: 35000,
            description:
                'Bahan Kanvas tebal, jahitan kuat dan rapi, cocok untuk sablon/lukis.',
        },
        {
            name: 'Topi Baseball Custom',
            idAlias: 'C06',
            price: 50000,
            description:
                'Bahan Rafel Denim, pengait besi anti karat, bisa bordir logo di depan.',
        },
        {
            name: 'Masker Kain Tiga Lapis',
            idAlias: 'C06',
            price: 10000,
            description:
                'Masker non-medis dengan tiga lapisan katun, tali earloop elastis.',
        },

        // --- Kategori C07: Perlengkapan Rumah Tangga ---
        {
            name: 'Bed Cover Set King Size',
            idAlias: 'C07',
            price: 450000,
            description:
                'Bahan Katun Disperse, termasuk 1 bed cover, 2 sarung bantal, 2 sarung guling.',
        },
        {
            name: 'Handuk Mandi Hotel Grade',
            idAlias: 'C07',
            price: 75000,
            description:
                'Handuk ukuran 70x140cm, bahan Cotton Terry 500 GSM, sangat tebal dan menyerap.',
        },
        {
            name: 'Taplak Meja Makan Linen',
            idAlias: 'C07',
            price: 90000,
            description:
                'Taplak meja persegi panjang (150x220cm), bahan Linen tebal, pinggiran jahit rapi.',
        },
    ]

    for (const prod of products) {
        const newProd = await prisma.product.create({
            data: {
                id: prod.name.toLowerCase().replace(/\s/g, '-'),
                name: prod.name,
                price: prod.price,
                description: prod.description,
                categoryId: categoryMap.get(prod.idAlias)!,
            },
        })
        console.log(
            `Created product with id: ${newProd.id} (Name: ${newProd.name})`,
        )
    }
    console.log('Product seeded successfully')

    // --- SEED DATA FAQ ---
    console.log('Seeding faq...')
    const faqs = [
        {
            question: 'Minimal order berapa?',
            answer: 'Minimal order kami untuk produk standar (kaos, polo, kemeja) adalah 12 pcs per desain/warna. Untuk produk khusus, jumlah bisa disesuaikan.',
        },
        {
            question: 'Apakah bisa custom desain?',
            answer: 'Tentu! Anda bisa mengirim desain sendiri (format vektor seperti AI, CDR, atau PDF resolusi tinggi) ke kami. Tim kami akan mengecek dan memastikan desain siap produksi.',
        },
        {
            question: 'Berapa lama waktu produksinya?',
            answer: 'Waktu produksi standar biasanya antara 14 hingga 21 hari kerja, tergantung kompleksitas desain, jumlah order, dan antrian produksi saat ini. Kami akan memberikan estimasi pasti setelah desain dan detail order disetujui.',
        },
        {
            question: 'Jenis bahan apa saja yang tersedia?',
            answer: 'Kami menyediakan berbagai macam bahan, seperti Cotton Combed (20s, 24s, 30s), Cotton Carded, Lacoste CVC/PE (untuk Polo), American Drill/Japan Drill (untuk Kemeja/Jaket), dan Fleece/Baby Terry (untuk Hoodie). Silakan konsultasikan kebutuhan Anda.',
        },
        {
            question: 'Metode sablon atau bordir apa yang digunakan?',
            answer: 'Untuk sablon, kami menggunakan metode Rubber/Karet, Plastisol, Discharge, dan Polyflex. Untuk bordir, kami menggunakan mesin bordir komputer yang menjamin kerapian dan presisi.',
        },
        {
            question: 'Bagaimana proses pemesanan dari awal sampai akhir?',
            answer: 'Prosesnya adalah: 1. **Konsultasi & Penawaran** (Desain, Jumlah, Bahan). 2. **Persetujuan Sampel** (jika diperlukan & order besar). 3. **Pembayaran DP** (biasanya 50%). 4. **Proses Produksi**. 5. **Quality Control**. 6. **Pelunasan & Pengiriman**.',
        },
        {
            question: 'Apakah ada garansi jika hasil tidak sesuai?',
            answer: 'Kami memberikan garansi revisi atau penggantian jika terdapat kesalahan produksi yang disebabkan oleh pihak kami (cacat produksi, salah ukuran/warna/desain). Klaim harus diajukan dalam waktu 3 hari setelah barang diterima.',
        },
        {
            question: 'Bagaimana cara menentukan ukuran yang tepat?',
            answer: 'Kami akan menyediakan *Size Chart* standar konveksi kami. Kami sangat menyarankan pelanggan untuk mengukur kembali baju yang nyaman dipakai dan mencocokannya dengan *size chart* kami.',
        },
        {
            question:
                'Apakah harga yang ditawarkan sudah termasuk bordir/sablon?',
            answer: 'Harga yang kami berikan adalah harga *all-in* yang sudah mencakup biaya produksi, bahan, dan aplikasi bordir/sablon standar (dengan batasan area/jumlah warna tertentu). Detail akan tercantum jelas di penawaran.',
        },
        {
            question:
                'Apakah bisa mengirimkan pesanan ke luar kota atau luar pulau?',
            answer: 'Ya, kami melayani pengiriman ke seluruh Indonesia. Biaya pengiriman akan ditanggung oleh pelanggan dan bisa menggunakan jasa ekspedisi langganan Anda atau rekomendasi dari kami.',
        },
    ]
    for (const faq of faqs) {
        const newFaq = await prisma.faq.create({
            data: faq,
        })
        console.log(`Created FAQ with id: ${newFaq.id}`)
    }
    console.log('FAQ seeded successfully')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
