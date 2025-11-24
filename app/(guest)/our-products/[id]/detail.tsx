import Image from 'next/image'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import type { Category, Product } from '@/lib/generated/prisma/client'
import { formatRupiah } from '@/lib/utils'

export default function Detail({
    product,
}: {
    product: Product & { category: Category }
}) {
    return (
        <section className='px-6 py-24'>
            <div className='mx-auto max-w-5xl'>
                <div className='mb-10 border-b pb-4'>
                    <h2 className='font-semibold text-3xl tracking-tight'>
                        Detail Produk
                    </h2>
                    <p className='mt-1 text-muted-foreground text-sm'>
                        Cool Cloth{' '}
                        <span className='font-medium text-primary'>
                            {product.id}
                        </span>{' '}
                        ·{' '}
                        {product.updatedAt.toLocaleDateString('id-ID', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}
                    </p>
                </div>

                <Card className='flex flex-col overflow-hidden md:flex-row md:items-center md:justify-between'>
                    <div className='flex items-center justify-center p-6 md:w-1/2'>
                        <Image
                            width={300}
                            height={300}
                            src={product?.image ?? '/placeholder.svg'}
                            alt={product?.name}
                            className='h-85 w-120 max-w-md rounded-sm object-cover shadow-lg'
                        />
                    </div>

                    <div className='flex flex-col justify-between p-8 md:w-1/2'>
                        <div>
                            <h1 className='mb-3 font-bold text-2xl'>
                                {product?.name}
                            </h1>
                            <p className='mb-2 font-semibold text-primary text-xl'>
                                {formatRupiah(product?.price)}
                            </p>
                            <p className='mb-6 text-muted-foreground text-sm leading-relaxed'>
                                {product?.description}
                            </p>
                        </div>

                        <div className='mt-4 border-t pt-4 text-muted-foreground text-sm'>
                            <p className='mt-1'>
                                Kategori:{' '}
                                <span className='text-muted-foreground'>
                                    {product?.category?.name}
                                </span>
                            </p>
                        </div>

                        <Link
                            target={'_blank'}
                            href={`https://wa.me/62859175727576?text=Halo%20saya%20ingin%20menanyakan%20pesanan%20#${product.name.toLowerCase().replace(/\s/g, '%20')}`}
                            className='mt-8 block rounded-lg bg-primary py-3 text-center font-semibold text-base text-white shadow-md transition-all duration-300 hover:bg-violet-700'
                        >
                            Hubungi Admin
                        </Link>
                    </div>
                </Card>
                <div className='mt-12 border-t pt-6 text-muted-foreground text-sm'>
                    <p>
                        Terakhir diperbarui:{' '}
                        <span className='font-medium text-muted-foreground'>
                            {product?.updatedAt.toLocaleDateString('id-ID', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </span>
                    </p>
                </div>
            </div>
        </section>
    )
}
