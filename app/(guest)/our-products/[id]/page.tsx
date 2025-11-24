import type { Metadata } from 'next'
import { getProduct } from '@/actions/product'
import Detail from '@/app/(guest)/our-products/[id]/detail'

export const metadata: Metadata = {
    title: 'Produk',
}

export default async function ProdukPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const product = await getProduct(id)
    return (
        <div>
            <Detail product={product as any} />
        </div>
    )
}
