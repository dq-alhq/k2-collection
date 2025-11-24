import { IconAlertCircle } from '@tabler/icons-react'
import Image from 'next/image'
import Link from 'next/link'
import { getProducts } from '@/actions/product'
import { Mdiv } from '@/components/animated'
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty'
import { formatRupiah } from '@/lib/utils'

export default async function ProductOverview({ search }: { search: string }) {
    const { data } = await getProducts({
        limit: 6,
        skip: 0,
        search,
    })
    return (
        <Mdiv className='mx-auto grid max-w-7xl grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3'>
            {data?.map((item) => (
                <div
                    className='group relative cursor-pointer overflow-hidden rounded-2xl'
                    key={item.id}
                >
                    <Image
                        src={item?.image || '/placeholder.svg'}
                        alt={item?.name || 'produk'}
                        width={100}
                        height={80}
                        className='h-80 w-full object-cover transition-all duration-500 group-hover:scale-105'
                    />

                    <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent' />

                    <div className='absolute bottom-0 p-6'>
                        <p className='mb-1 text-gray-300 text-sm'>
                            {item?.name}
                        </p>
                        <h3 className='mb-3 font-semibold text-2xl text-white'>
                            {formatRupiah(item?.price)}
                        </h3>
                        <Link
                            href={`/our-products/${item?.id}`}
                            className='inline-block rounded-md bg-violet-600 px-4 py-2 font-semibold text-sm transition hover:bg-violet-700'
                        >
                            Lihat Detail
                        </Link>
                    </div>
                </div>
            ))}
            {data?.length === 0 && (
                <Empty className='col-span-full'>
                    <EmptyHeader>
                        <EmptyMedia variant='icon'>
                            <IconAlertCircle />
                        </EmptyMedia>
                        <EmptyTitle>Tidak ada data</EmptyTitle>
                        <EmptyDescription>
                            Produk yang anda cari tidak ditemukan
                        </EmptyDescription>
                    </EmptyHeader>
                </Empty>
            )}
        </Mdiv>
    )
}
