'use client'

import { IconEdit, IconTrash } from '@tabler/icons-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { deleteCategory } from '@/actions/category'
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
import type { Category } from '@/lib/generated/prisma/client'

export function CategoryTable({ data }: { data: Category[] }) {
    const handleDelete = async (id: string) => {
        const { success, message } = await deleteCategory(id)
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
                        <TableHead>Nama</TableHead>
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
                            <TableCell className='flex w-full justify-end'>
                                <div className='flex items-center gap-2'>
                                    <Link
                                        href={`/categories/edit/${item.id}`}
                                        className={buttonVariants({
                                            size: 'icon-sm',
                                        })}
                                    >
                                        <IconEdit />
                                    </Link>
                                    <AlertModal
                                        title='Hapus Kategori'
                                        description='Yakin ingin menghapus kategori ini?'
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
