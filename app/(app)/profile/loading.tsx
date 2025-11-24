import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
    return (
        <div className='flex flex-1 flex-col'>
            <div className='flex flex-col gap-2 p-4 md:p-6'>
                <Skeleton className='h-8 w-32' />
                <Skeleton className='h-5 w-80' />
            </div>
            <div className='flex flex-col gap-6 p-4 md:p-6'>
                <Skeleton className='h-72 w-full rounded-xl' />
                <Skeleton className='h-72 w-full rounded-xl' />
                <Skeleton className='h-72 w-full rounded-xl' />
                <Skeleton className='h-72 w-full rounded-xl' />
                <Skeleton className='h-72 w-full rounded-xl' />
                <Skeleton className='h-72 w-full rounded-xl' />
            </div>
        </div>
    )
}
