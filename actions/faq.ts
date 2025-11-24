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

export const getFaqs = async ({
    limit,
    skip,
    search,
    sortBy = 'question',
    order = 'asc',
}: Props) => {
    const data = await prisma.faq.findMany({
        take: limit,
        skip: skip,
        where: {
            OR: [
                {
                    question: {
                        contains: search,
                        mode: 'insensitive',
                    },
                },
                {
                    answer: {
                        contains: search,
                        mode: 'insensitive',
                    },
                },
            ],
        },
        orderBy: { [sortBy]: order },
    })

    const totalData = await prisma.faq.count({
        where: {
            OR: [
                {
                    question: {
                        contains: search,
                        mode: 'insensitive',
                    },
                },
                {
                    answer: {
                        contains: search,
                        mode: 'insensitive',
                    },
                },
            ],
        },
    })

    const totalPages = Math.ceil(totalData / limit)
    return { data, totalData, totalPages }
}

export const getFaq = async (id: string) => {
    return prisma.faq.findUnique({ where: { id } })
}

export const getFaqList = async () => {
    return prisma.faq.findMany({
        select: {
            id: true,
            question: true,
            answer: true,
        },
    })
}

export const createOrUpdateFaq = async ({
    id,
    data,
}: {
    id?: string
    data: { question: string; answer: string }
}) => {
    try {
        if (id) {
            await prisma.faq.update({ where: { id }, data })
            return { success: true, message: 'FAQ berhasil diperbarui' }
        }
        await prisma.faq.create({ data })
        revalidatePath('/faqs')
        return { success: true, message: 'FAQ berhasil ditambahkan' }
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

export const deleteFaq = async (id: string) => {
    try {
        await prisma.faq.delete({ where: { id } })
        revalidatePath('/faqs')
        return { success: true, message: 'FAQ berhasil dihapus' }
    } catch (error) {
        return {
            success: false,
            message:
                error instanceof Error ? error.message : 'Gagal hapus kategori',
        }
    }
}
