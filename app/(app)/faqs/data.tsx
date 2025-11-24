import { getFaqs } from '@/actions/faq'
import { FaqTable } from '@/app/(app)/faqs/table'
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
        sortBy = 'question',
        order = 'asc',
    } = await searchParams

    const limit = 10
    const skip = (Number(page) - 1) * limit

    const { data, totalData, totalPages } = await getFaqs({
        limit,
        skip,
        search,
        sortBy,
        order,
    })
    return (
        <>
            <FaqTable data={data} />
            <Paginator
                currentData={data.length}
                total={totalData}
                currentPage={Number(page)}
                totalPages={totalPages}
            />
        </>
    )
}
