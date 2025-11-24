import { IconArrowLeft } from '@tabler/icons-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import CategoryForm from '@/app/(app)/categories/form'
import { buttonVariants } from '@/components/ui/button'

export const metadata: Metadata = {
    title: 'Tambah Kategori',
}

export default function TambahProdukPage() {
    return (
        <div className='space-y-4 py-4 md:py-6'>
            <div className='flex justify-between p-4 md:px-6'>
                <div>
                    <h1 className='font-bold text-2xl'>Tambah Kategori</h1>
                    <p className='text-muted-foreground text-sm'>
                        Isi form berikut untuk tambah kategori
                    </p>
                </div>
                <Link className={buttonVariants()} href='/categories'>
                    <IconArrowLeft />
                    Kembali
                </Link>
            </div>
            <div className='px-4 md:px-6'>
                <CategoryForm />
            </div>
        </div>
    )
}
