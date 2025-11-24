import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
    return (
        <section className='px-6 py-24'>
            <div className='mx-auto max-w-5xl'>
                {/* Header Skeleton */}
                <div className='mb-10 border-b pb-4'>
                    <Skeleton className='mb-2 h-8 w-64' />
                    <Skeleton className='h-4 w-80' />
                </div>

                {/* Main Content Skeleton */}
                <div className='flex flex-col overflow-hidden rounded-lg border md:flex-row'>
                    {/* Image Skeleton */}
                    <div className='flex items-center justify-center p-6 md:w-1/2'>
                        <Skeleton className='h-96 w-full max-w-md' />
                    </div>

                    {/* Details Skeleton */}
                    <div className='flex flex-col justify-between p-8 md:w-1/2'>
                        <div>
                            <Skeleton className='mb-4 h-8 w-3/4' />
                            <Skeleton className='mb-6 h-6 w-32' />
                            <div className='space-y-2'>
                                <Skeleton className='h-4 w-full' />
                                <Skeleton className='h-4 w-5/6' />
                                <Skeleton className='h-4 w-4/5' />
                                <Skeleton className='h-4 w-3/4' />
                            </div>
                        </div>

                        <div className='mt-6 space-y-2 border-t pt-4'>
                            <Skeleton className='h-4 w-24' />
                            <Skeleton className='h-4 w-32' />
                        </div>

                        <Skeleton className='mt-8 h-12 w-full' />
                    </div>
                </div>

                {/* Footer Skeleton */}
                <div className='mt-12 border-t pt-6'>
                    <Skeleton className='h-4 w-48' />
                </div>
            </div>
        </section>
    )
}
