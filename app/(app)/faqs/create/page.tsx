import { IconArrowLeft } from '@tabler/icons-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import FaqForm from '@/app/(app)/faqs/form'
import { buttonVariants } from '@/components/ui/button'

export const metadata: Metadata = {
    title: 'Tambah FAQ',
}

export default function TambahFAQPage() {
    return (
        <div className='space-y-4 py-4 md:py-6'>
            <div className='flex justify-between p-4 md:px-6'>
                <div>
                    <h1 className='font-bold text-2xl'>Tambah FAQ</h1>
                    <p className='text-muted-foreground text-sm'>
                        Isi form berikut untuk tambah FAQ
                    </p>
                </div>
                <Link className={buttonVariants()} href='/faqs'>
                    <IconArrowLeft />
                    Kembali
                </Link>
            </div>
            <div className='px-4 md:px-6'>
                <FaqForm />
            </div>
        </div>
    )
}
