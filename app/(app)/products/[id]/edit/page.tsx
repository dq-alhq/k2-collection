import { IconArrowLeft } from '@tabler/icons-react'
import Link from 'next/link'
import { getProduct } from '@/actions/product'
import ProductForm from '@/app/(app)/products/form'
import { buttonVariants } from '@/components/ui/button'

export const metadata = {
    title: 'Edit Produk',
}

export default async function EditProdukPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const data = await getProduct(id)
    return (
        <div className='space-y-4 py-4 md:py-6'>
            <div className='flex justify-between p-4 md:px-6'>
                <div>
                    <h1 className='font-bold text-2xl'>Edit Produk</h1>
                    <p className='text-muted-foreground text-sm'>
                        Isi form berikut untuk mengedit produk
                    </p>
                </div>
                <Link className={buttonVariants()} href='/products'>
                    <IconArrowLeft />
                    Kembali
                </Link>
            </div>
            <div className='p-4'>
                <ProductForm currentData={data as any} />
            </div>
        </div>
    )
}
