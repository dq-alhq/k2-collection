import type { Metadata } from 'next'
import ProductForm from '@/app/(app)/products/form'
import { Modal } from '@/components/modal'

export const metadata: Metadata = {
    title: 'Tambah Produk',
}

export default function ModalAddRolePage() {
    return (
        <Modal
            title='Tambah Produk'
            description='Silakan isikan form di bawah ini untuk menambahkan produk'
        >
            <div className='p-4'>
                <ProductForm />
            </div>
        </Modal>
    )
}
