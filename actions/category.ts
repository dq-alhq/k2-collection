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

export const checkCategoryExists = async (id: string) => {
    const category = await prisma.category.findUnique({ where: { id } })
    return !!category
}

export const getCategories = async ({
    limit,
    skip,
    search,
    sortBy = 'name',
    order = 'asc',
}: Props) => {
    const data = await prisma.category.findMany({
        take: limit,
        skip: skip,
        where: {
            name: {
                contains: search,
                mode: 'insensitive',
            },
        },
        include: {
            _count: {
                select: {
                    Product: true,
                },
            },
        },
        orderBy: { [sortBy]: order },
    })

    const totalData = await prisma.category.count({
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

export const getCategory = async (id: string) => {
    return prisma.category.findUnique({ where: { id } })
}

export const getCategoriesList = async () => {
    return prisma.category.findMany({
        select: {
            id: true,
            name: true,
        },
    })
}

export const createOrUpdateCategory = async ({
    id,
    data,
}: {
    id?: string
    data: { name: string }
}) => {
    try {
        if (id) {
            await prisma.category.update({ where: { id }, data })
            return { success: true, message: 'Kategori berhasil diperbarui' }
        }
        await prisma.category.create({ data })
        revalidatePath('/categories')
        return { success: true, message: 'Kategori berhasil ditambahkan' }
    } catch (error) {
        return {
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : 'Gagal menyimpan Kategori',
        }
    }
}

export const deleteCategory = async (id: string) => {
    try {
        await prisma.category.delete({ where: { id } })
        revalidatePath('/categories')
        return { success: true, message: 'Kategori berhasil dihapus' }
    } catch (error) {
        return {
            success: false,
            message:
                error instanceof Error ? error.message : 'Gagal hapus kategori',
        }
    }
}
