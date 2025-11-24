import type { Metadata } from 'next'
import { getCategory } from '@/actions/category'
import CategoryForm from '@/app/(app)/categories/form'
import { Modal } from '@/components/modal'

export const metadata: Metadata = {
    title: 'Edit Kategori',
}

export default async function ModalEditProductPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const data = await getCategory(id)
    return (
        <Modal
            title='Edit Kategori'
            description='Silakan isikan form di bawah ini untuk mengedit kategori'
        >
            <div className='p-4'>
                <CategoryForm currentData={data as any} />
            </div>
        </Modal>
    )
}
