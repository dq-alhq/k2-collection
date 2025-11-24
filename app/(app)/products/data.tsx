import { getProducts } from '@/actions/product'
import { ProductTable } from '@/app/(app)/products/table'
import { Paginator } from '@/components/paginator'

interface searchParams {
    page?: string
    search?: string
    sortBy?: string
    order?: 'asc' | 'desc'
    category?: string
}

export default async function Data({
    searchParams,
}: {
    searchParams: Promise<searchParams>
}) {
    const {
        page = 1,
        search = '',
        sortBy = 'name',
        order = 'asc',
    } = await searchParams

    const limit = 10
    const skip = (Number(page) - 1) * limit

    const { data, totalData, totalPages } = await getProducts({
        limit,
        skip,
        search,
        sortBy,
        order,
    })
    return (
        <>
            <ProductTable data={data as any} />
            <Paginator
                currentData={data.length}
                total={totalData}
                currentPage={Number(page)}
                totalPages={totalPages}
            />
        </>
    )
}
