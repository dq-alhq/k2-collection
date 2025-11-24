import { IconBolt, IconShirt, IconWorld } from '@tabler/icons-react'
import { Mdiv } from '@/components/animated'

export default function Features() {
    return (
        <Mdiv className='mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-8 px-4 sm:grid-cols-3 md:px-6'>
            <div className='flex flex-col items-center'>
                <IconShirt className='mb-4 size-12 text-primary' />
                <h3 className='mb-2 font-semibold text-xl'>
                    Bahan & Sablon Lengkap
                </h3>
                <p className='text-muted-foreground text-sm'>
                    Tersedia bahan cotton, fleece, drill & sablon DTF, rubber,
                    plastisol, bordir.
                </p>
            </div>

            <div className='flex flex-col items-center'>
                <IconBolt className='mb-4 size-12 text-primary' />
                <h3 className='mb-2 font-semibold text-xl'>Pengerjaan Cepat</h3>
                <p className='text-muted-foreground text-sm'>
                    Estimasi 3–10 hari untuk 12–50 pcs. Bisa express.
                </p>
            </div>

            <div className='flex flex-col items-center'>
                <IconWorld className='mb-4 size-12 text-primary' />
                <h3 className='mb-2 font-semibold text-xl'>
                    Pengiriman ke Seluruh Penjuru
                </h3>
                <p className='text-muted-foreground text-sm'>
                    Kami siap mengirimkan pakaian custom ke seluruh penjuru
                    Dunia dan Akhirat.
                </p>
            </div>
        </Mdiv>
    )
}
