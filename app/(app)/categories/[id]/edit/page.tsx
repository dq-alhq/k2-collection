import { IconArrowLeft } from '@tabler/icons-react'
import Link from 'next/link'
import { getCategory } from '@/actions/category'
import CategoryForm from '@/app/(app)/categories/form'
import { buttonVariants } from '@/components/ui/button'

export const metadata = {
    title: 'Edit Kategori',
}

export default async function EditKategoriPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const data = await getCategory(id)
    return (
        <div className='space-y-4 py-4 md:py-6'>
            <div className='flex justify-between p-4 md:px-6'>
                <div>
                    <h1 className='font-bold text-2xl'>Edit Kategori</h1>
                    <p className='text-muted-foreground text-sm'>
                        Isi form berikut untuk mengedit kategori
                    </p>
                </div>
                <Link className={buttonVariants()} href='/categories'>
                    <IconArrowLeft />
                    Kembali
                </Link>
            </div>
            <div className='px-4 md:px-6'>
                <CategoryForm currentData={data as any} />
            </div>
        </div>
    )
}
