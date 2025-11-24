'use server'

import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'

type Props = {
    limit: number
    skip: number
    search?: string
    sortBy?: string
    order?: 'asc' | 'desc'
}

export const getProducts = async ({
    limit,
    skip,
    search,
    sortBy = 'name',
    order = 'asc',
}: Props) => {
    const data = await prisma.product.findMany({
        take: limit,
        skip: skip,
        where: {
            name: {
                contains: search,
                mode: 'insensitive',
            },
        },
        include: {
            category: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
        orderBy: { [sortBy]: order },
    })

    const totalData = await prisma.product.count({
        where: {
            name: {
                contains: search,
                mode: 'insensitive',
            },
        },
    })

    const totalPages = Math.ceil(totalData / limit)
    return { data, totalData, totalPages }
}

export const getProduct = async (id: string) => {
    return prisma.product.findUnique({
        where: { id },
        include: { category: { select: { name: true } } },
    })
}

export const createOrUpdateProduct = async ({
    id,
    data,
}: {
    id?: string
    data: {
        name: string
        price: number
        description: string
        image: string
        categoryId: string
    }
}) => {
    try {
        if (id) {
            await prisma.product.update({
                where: { id },
                data: { ...data },
            })
            return { success: true, message: 'Produk berhasil diperbarui' }
        }
        await prisma.product.create({ data: { ...data } })
        revalidatePath('/products')
        return { success: true, message: 'Produk berhasil ditambahkan' }
    } catch (error) {
        return {
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : 'Gagal menyimpan Produk',
        }
    }
}

export const deleteProduct = async (id: string) => {
    try {
        await prisma.product.delete({ where: { id } })
        revalidatePath('/products')
        return { success: true, message: 'Produk berhasil dihapus' }
    } catch (error) {
        return {
            success: false,
            message:
                error instanceof Error ? error.message : 'Gagal hapus produk',
        }
    }
}
