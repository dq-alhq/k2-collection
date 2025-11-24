import { Mdiv } from '@/components/animated'

export default function Tentang() {
    return (
        <Mdiv className='mx-auto text-center'>
            <h2 className='mb-4 font-bold text-4xl text-white'>
                Tentang <span className='text-primary'>K2 Collection</span>
            </h2>
            <p className='mx-auto max-w-3xl text-gray-400 text-lg leading-relaxed'>
                <span className='font-semibold text-white'>K2 Collection</span>{' '}
                adalah usaha konveksi lokal yang bergerak di bidang pembuatan
                pakaian custom untuk komunitas, sekolah, perusahaan, event,
                hingga instansi. Kami dikenal karena kualitas jahitan rapi,
                pilihan bahan lengkap, konsultasi desain gratis, dan proses
                pengerjaan cepat sesuai estimasi.
            </p>
        </Mdiv>
    )
}
