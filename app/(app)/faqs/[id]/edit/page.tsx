import { IconArrowLeft } from '@tabler/icons-react'
import Link from 'next/link'
import { getFaq } from '@/actions/faq'
import FaqForm from '@/app/(app)/faqs/form'
import { buttonVariants } from '@/components/ui/button'

export const metadata = {
    title: 'Edit FAQ',
}

export default async function EditFAQPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const data = await getFaq(id)
    return (
        <div className='space-y-4 py-4 md:py-6'>
            <div className='flex justify-between p-4 md:px-6'>
                <div>
                    <h1 className='font-bold text-2xl'>Edit FAQ</h1>
                    <p className='text-muted-foreground text-sm'>
                        Isi form berikut untuk mengedit FAQ
                    </p>
                </div>
                <Link className={buttonVariants()} href='/faqs'>
                    <IconArrowLeft />
                    Kembali
                </Link>
            </div>
            <div className='px-4 md:px-6'>
                <FaqForm currentData={data as any} />
            </div>
        </div>
    )
}
