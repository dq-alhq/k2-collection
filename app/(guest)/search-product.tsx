'use client'
import Form from 'next/form'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function SearchProduct() {
    const searchParams = useSearchParams()
    const search = searchParams.get('search')
    return (
        <Form
            action='/our-products'
            className='mt-8 flex w-full max-w-md flex-row flex-wrap items-center justify-center gap-3 sm:flex-nowrap'
        >
            <Input
                defaultValue={search ?? ''}
                name='search'
                type='text'
                placeholder='Cari Produk...'
                className='h-10 darK:text-white placeholder-white/70 focus:ring-violet-500 md:text-base dark:border-white/20 dark:bg-white/10'
            />
            <Button type='submit' size='lg'>
                Cari
            </Button>
        </Form>
    )
}
