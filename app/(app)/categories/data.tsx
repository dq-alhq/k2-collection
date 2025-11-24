import { getCategories } from '@/actions/category'
import { CategoryTable } from '@/app/(app)/categories/table'
import { Paginator } from '@/components/paginator'

interface searchParams {
    page?: string
    search?: string
    sortBy?: string
    order?: 'asc' | 'desc'
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

    const { data, totalData, totalPages } = await getCategories({
        limit,
        skip,
        search,
        sortBy,
        order,
    })
    return (
        <>
            <CategoryTable data={data} />
            <Paginator
                currentData={data.length}
                total={totalData}
                currentPage={Number(page)}
                totalPages={totalPages}
            />
        </>
    )
}
