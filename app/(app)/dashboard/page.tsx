import type { Metadata } from 'next'
import { Suspense } from 'react'
import { SectionCards } from '@/app/(app)/dashboard/section-cards'
import Data from '@/app/(app)/products/data'
import { Skeleton } from '@/components/ui/skeleton'

export const metadata: Metadata = {
    title: 'Dashboard',
}

interface searchParams {
    page?: string
    search?: string
    sortBy?: string
    order?: 'asc' | 'desc'
    category?: string
}

export default async function DashboardPage({
    searchParams,
}: {
    searchParams: Promise<searchParams>
}) {
    const params = await searchParams
    return (
        <div className='flex flex-1 flex-col'>
            <div className='@container/main flex flex-1 flex-col gap-2'>
                <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>
                    <SectionCards />
                    <Suspense
                        key={JSON.stringify(params)}
                        fallback={
                            <div className='px-4 md:px-6'>
                                <Skeleton className='h-[400px] w-full' />
                            </div>
                        }
                    >
                        <Data searchParams={searchParams} />
                    </Suspense>
                </div>
            </div>
        </div>
    )
}
