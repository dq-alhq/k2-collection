import z from 'zod'
import { checkCategoryExists } from '@/actions/category'

export const emailSchema = z.email({ message: 'Email tidak valid' })

export const passwordSchema = z
    .string()
    .min(8, { message: 'Password minimal 8 karakter' })

export const categorySchema = z.object({
    name: z.string().min(3, { message: 'Nama minimal 3 karakter' }),
})

export type CategorySchema = z.infer<typeof categorySchema>

export const productSchema = z.object({
    name: z.string().min(3, { message: 'Nama minimal 3 karakter' }),
    price: z
        .number('Harga harus berupa angka')
        .min(0, { message: 'Harga minimal 0' }),
    description: z.string().min(3, { message: 'Deskripsi minimal 3 karakter' }),
    categoryId: z
        .string()
        .refine(async (value) => await checkCategoryExists(value), {
            message: 'Kategori tidak ditemukan',
        }),
    image: z.string(),
})

export type ProductSchema = z.infer<typeof productSchema>

export const profileSchema = z.object({
    name: z.string().min(3, { message: 'Nama minimal 3 karakter' }),
    email: emailSchema,
    password: passwordSchema,
})

export type ProfileSchema = z.infer<typeof profileSchema>
