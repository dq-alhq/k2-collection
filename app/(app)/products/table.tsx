'use client'

import { IconEdit, IconSelector, IconTrash } from '@tabler/icons-react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { useDebouncedCallback } from 'use-debounce'
import { deleteProduct } from '@/actions/product'
import { AlertModal } from '@/components/alert-modal'
import { Button, buttonVariants } from '@/components/ui/button'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import type { Category, Product } from '@/lib/generated/prisma/client'
import { formatRupiah } from '@/lib/utils'

type ProductWithCategory = Product & { category: Category }

export function ProductTable({ data }: { data: ProductWithCategory[] }) {
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const { replace } = useRouter()

    const handleSort = useDebouncedCallback((sortBy: string) => {
        const params = new URLSearchParams(searchParams)
        params.set('sortBy', sortBy)
        params.set('order', params.get('order') === 'asc' ? 'desc' : 'asc')
        replace(`${pathname}?${params.toString()}`)
    }, 500)

    const handleDelete = async (id: string) => {
        const { success, message } = await deleteProduct(id)
        if (success) {
            toast.success(message)
        } else {
            toast.error(message)
        }
    }
    return (
        <div className='w-full'>
            <Table>
                <TableHeader>
                    <TableRow className='*:[th]:first:pl-4 *:[th]:last:pr-4 md:*:[th]:last:pr-6 md:*:[th]:first:pl-6'>
                        <TableHead className='w-14'>#</TableHead>
                        <TableHead
                            className='flex cursor-pointer items-center gap-2'
                            onClick={() => handleSort('name')}
                        >
                            Nama
                            <IconSelector className='size-4 text-muted-foreground' />
                        </TableHead>
                        <TableHead>Kategori</TableHead>
                        <TableHead
                            className='flex cursor-pointer items-center gap-2'
                            onClick={() => handleSort('price')}
                        >
                            Harga
                            <IconSelector className='size-4 text-muted-foreground' />
                        </TableHead>
                        <TableHead />
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data?.map((item, i) => (
                        <TableRow
                            className='*:[td]:first:pl-4 *:[td]:last:pr-4 md:*:[td]:last:pr-6 md:*:[td]:first:pl-6'
                            key={i}
                        >
                            <TableCell>{i + 1}</TableCell>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.category.name}</TableCell>
                            <TableCell>{formatRupiah(item.price)}</TableCell>
                            <TableCell className='flex w-full justify-end'>
                                <div className='flex items-center gap-2'>
                                    <Link
                                        href={`/products/edit/${item.id}`}
                                        className={buttonVariants({
                                            size: 'icon-sm',
                                        })}
                                    >
                                        <IconEdit />
                                    </Link>
                                    <AlertModal
                                        title='Hapus Produk'
                                        description='Yakin ingin menghapus produk ini?'
                                        onConfirm={() => handleDelete(item.id)}
                                    >
                                        <Button
                                            size='icon-sm'
                                            variant='destructive'
                                        >
                                            <IconTrash />
                                        </Button>
                                    </AlertModal>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
