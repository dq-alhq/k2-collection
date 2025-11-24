import type { Metadata } from 'next'
import FaqForm from '@/app/(app)/faqs/form'
import { Modal } from '@/components/modal'

export const metadata: Metadata = {
    title: 'Tambah FAQ',
}

export default function ModalCreateFAQPage() {
    return (
        <Modal
            title='Tambah FAQ'
            description='Silakan isikan form di bawah ini untuk menambahkan FAQ'
        >
            <div className='p-4'>
                <FaqForm />
            </div>
        </Modal>
    )
}
