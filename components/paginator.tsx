'use client'

import {
    IconChevronLeft,
    IconChevronRight,
    IconChevronsLeft,
    IconChevronsRight,
} from '@tabler/icons-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface Props {
    className?: string
    currentData: number
    total: number
    currentPage: number
    totalPages: number
}

export function Paginator({
    className,
    currentData,
    total,
    currentPage,
    totalPages,
}: Props) {
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const { replace } = useRouter()
    const handleNavigate = useDebouncedCallback((page) => {
        const params = new URLSearchParams(searchParams)
        if (page) {
            params.set('page', page)
        } else {
            params.delete('page')
        }
        replace(`${pathname}?${params.toString()}`)
    }, 150)
    return (
        <div
            className={cn(
                'flex items-center justify-between px-4 md:px-6',
                className,
            )}
        >
            <div className='flex w-fit items-center justify-center font-medium text-sm'>
                Menampilkan {currentData} dari {total} data
            </div>
            <div className='ml-auto flex items-center gap-2 lg:ml-0'>
                <Button
                    variant='outline'
                    className='hidden h-8 w-8 p-0 lg:flex'
                    disabled={currentPage === 1}
                    onClick={() => handleNavigate(1)}
                >
                    <span className='sr-only'>Go to first page</span>
                    <IconChevronsLeft />
                </Button>
                <Button
                    variant='outline'
                    className='size-8'
                    size='icon'
                    onClick={() => handleNavigate(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    <span className='sr-only'>Go to previous page</span>
                    <IconChevronLeft />
                </Button>
                <Button
                    variant='outline'
                    className='pointer-events-none size-8'
                    size='icon'
                >
                    {currentPage}
                </Button>
                <Button
                    variant='outline'
                    className='size-8'
                    size='icon'
                    onClick={() => handleNavigate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    <span className='sr-only'>Go to next page</span>
                    <IconChevronRight />
                </Button>
                <Button
                    variant='outline'
                    className='hidden size-8 lg:flex'
                    size='icon'
                    onClick={() => handleNavigate(totalPages)}
                    disabled={currentPage === totalPages}
                >
                    <span className='sr-only'>Go to last page</span>
                    <IconChevronsRight />
                </Button>
            </div>
        </div>
    )
}
