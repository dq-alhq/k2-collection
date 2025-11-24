import type { Metadata } from 'next'
import { getFaq } from '@/actions/faq'
import FaqForm from '@/app/(app)/faqs/form'
import { Modal } from '@/components/modal'

export const metadata: Metadata = {
    title: 'Edit FAQ',
}

export default async function ModalEditFAQPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const data = await getFaq(id)
    return (
        <Modal
            title='Edit FAQ'
            description='Silakan isikan form di bawah ini untuk mengedit FAQ'
        >
            <div className='p-4'>
                <FaqForm currentData={data as any} />
            </div>
        </Modal>
    )
}
