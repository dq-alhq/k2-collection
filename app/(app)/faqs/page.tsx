import { IconClipboardPlus } from '@tabler/icons-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import Data from '@/app/(app)/faqs/data'
import { SearchInput } from '@/components/search-input'
import { buttonVariants } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

export const metadata: Metadata = {
    title: 'FAQ',
}

interface searchParams {
    page?: string
    search?: string
    sortBy?: string
    order?: 'asc' | 'desc'
    category?: string
}

export default async function FaqPage({
    searchParams,
}: {
    searchParams: Promise<searchParams>
}) {
    const params = await searchParams
    return (
        <div className='space-y-4 py-4 md:py-6'>
            <div className='flex justify-between p-4 md:px-6'>
                <div>
                    <h1 className='font-bold text-2xl'>FAQ</h1>
                    <p className='text-muted-foreground text-sm'>Daftar FAQ</p>
                </div>
                <Link className={buttonVariants()} href='/faqs/create'>
                    <IconClipboardPlus />
                    Tambah Data
                </Link>
            </div>
            <div className='mb-4 flex items-center justify-between px-4 md:px-6'>
                <SearchInput />
            </div>
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
    )
}
