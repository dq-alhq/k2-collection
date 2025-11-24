import { IconArrowRight } from '@tabler/icons-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import BgCarousel from '@/app/(guest)/(home)/bg-carousel'
import Hero from '@/app/(guest)/(home)/hero'
import Features from '@/app/(guest)/features'
import ProductOverview from '@/app/(guest)/product-overview'
import Tentang from '@/app/(guest)/tentang'
import { Mdiv } from '@/components/animated'
import { buttonVariants } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

export const metadata: Metadata = {
    title: 'Home',
}

export default function HomePage() {
    return (
        <>
            <section className='relative h-[85vh] w-full overflow-hidden'>
                <BgCarousel />
                <Hero />
            </section>
            <section className='relative px-6 py-24'>
                <Mdiv className='mx-auto mb-14 text-center'>
                    <h2 className='mb-3 space-x-2 font-bold text-4xl'>
                        <span className='text-foreground'>Produk</span>
                        <span className='text-primary'>K2 Collection</span>
                    </h2>
                    <p className='mx-auto max-w-2xl text-muted-foreground'>
                        Pilihan produk konveksi terbaik dengan kualitas bahan
                        premium dan pengerjaan rapi.
                    </p>
                </Mdiv>
                <Suspense
                    key='home'
                    fallback={
                        <div className='mx-auto grid max-w-7xl grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3'>
                            <Skeleton className='h-80 w-full' />
                            <Skeleton className='h-80 w-full' />
                            <Skeleton className='h-80 w-full' />
                            <Skeleton className='h-80 w-full' />
                            <Skeleton className='h-80 w-full' />
                            <Skeleton className='h-80 w-full' />
                        </div>
                    }
                >
                    <ProductOverview search={''} />
                </Suspense>
                <Mdiv className='mt-8 flex justify-center'>
                    <Link
                        href='#'
                        className={buttonVariants({
                            size: 'lg',
                            className: 'hover:scale-110 hover:gap-4',
                        })}
                    >
                        Lihat Semua Produk
                        <IconArrowRight />
                    </Link>
                </Mdiv>
            </section>
            <section className='relative px-6 py-20'>
                <Tentang />
                <Features />
                <Mdiv className='mt-14 flex justify-center'>
                    <Link
                        href='/about'
                        className={buttonVariants({ size: 'lg' })}
                    >
                        Selengkapnya
                        <IconArrowRight />
                    </Link>
                </Mdiv>
            </section>
        </>
    )
}
