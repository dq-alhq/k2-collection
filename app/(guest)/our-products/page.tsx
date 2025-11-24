import type { Metadata } from 'next'
import { Suspense } from 'react'
import ProductOverview from '@/app/(guest)/product-overview'
import SearchProduct from '@/app/(guest)/search-product'
import { Mdiv } from '@/components/animated'
import { Skeleton } from '@/components/ui/skeleton'

export const metadata: Metadata = {
    title: 'Produk Kami',
}

export default async function ProdukKamiPage({
    searchParams,
}: {
    searchParams: Promise<{ search?: string }>
}) {
    const params = await searchParams
    return (
        <div className='py-24'>
            <Mdiv className='mx-auto max-w-7xl px-4 text-center md:px-6 lg:px-8'>
                <h2 className='mb-3 space-x-2 font-bold text-4xl'>
                    <span className='text-foreground'>Produk</span>
                    <span className='text-primary'>K2 Collection</span>
                </h2>
                <p className='mx-auto max-w-2xl text-muted-foreground'>
                    Pilihan produk konveksi terbaik dengan kualitas bahan
                    premium dan pengerjaan rapi.
                </p>
            </Mdiv>
            <Mdiv className='mx-auto mb-12 flex justify-center px-4 md:px-6 lg:px-8'>
                <SearchProduct />
            </Mdiv>
            <div className='px-6'>
                <Suspense
                    key={JSON.stringify(params)}
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
                    <ProductOverview search={params?.search || ''} />
                </Suspense>
            </div>
        </div>
    )
}
