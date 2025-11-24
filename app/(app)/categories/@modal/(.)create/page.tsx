import type { Metadata } from 'next'
import CategoryForm from '@/app/(app)/categories/form'
import { Modal } from '@/components/modal'

export const metadata: Metadata = {
    title: 'Tambah Kategori',
}

export default function ModalCreateCategoryPage() {
    return (
        <Modal
            title='Tambah Kategori'
            description='Silakan isikan form di bawah ini untuk menambahkan kategori'
        >
            <div className='p-4'>
                <CategoryForm />
            </div>
        </Modal>
    )
}
