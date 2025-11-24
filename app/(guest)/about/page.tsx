import type { Metadata } from 'next'
import BgCarousel from '@/app/(guest)/(home)/bg-carousel'
import Contact from '@/app/(guest)/about/contact'
import Features from '@/app/(guest)/features'
import Tentang from '@/app/(guest)/tentang'

export const metadata: Metadata = {
    title: 'Tentang',
}

export default function TentangPage() {
    return (
        <div>
            <section className='relative h-[60vh] w-full overflow-hidden py-20'>
                <BgCarousel />
                <div className='relative z-10 flex h-full flex-col items-center justify-center'>
                    <Tentang />
                </div>
            </section>

            <div className='py-12'>
                <Features />
            </div>

            <section className='relative px-6 py-20'>
                <Contact />
            </section>
        </div>
    )
}
