import { getProduct } from '@/actions/product'
import ProductForm from '@/app/(app)/products/form'
import { Modal } from '@/components/modal'

export const metadata = {
    title: 'Edit Produk',
}

export default async function ModalEditProductPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const data = await getProduct(id)
    return (
        <Modal
            title='Edit Produk'
            description='Silakan isikan form di bawah ini untuk mengedit produk'
        >
            <div className='p-4'>
                <ProductForm currentData={data as any} />
            </div>
        </Modal>
    )
}
