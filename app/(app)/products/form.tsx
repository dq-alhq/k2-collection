'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { getCategoriesList } from '@/actions/category'
import { createOrUpdateProduct } from '@/actions/product'
import { Button } from '@/components/ui/button'
import {
    Field,
    FieldContent,
    FieldError,
    FieldGroup,
    FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
    InputGroupText,
    InputGroupTextarea,
} from '@/components/ui/input-group'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import { InputImage } from '@/components/upload-image'
import type { Category, Product } from '@/lib/generated/prisma/client'
import { uploadImage } from '@/lib/upload-image'
import { isUrl } from '@/lib/utils'
import { type ProductSchema, productSchema } from '@/lib/zod'

export default function ProductForm({
    currentData,
}: {
    currentData?: Product & { category: Pick<Category, 'id' | 'name'> }
}) {
    const [loading, setLoading] = useState(false)
    const [categories, setCategories] = useState<
        Pick<Category, 'id' | 'name'>[]
    >([])

    const { back } = useRouter()

    const form = useForm<ProductSchema>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: currentData?.name ?? '',
            price: currentData?.price ?? 0,
            description: currentData?.description ?? '',
            categoryId: currentData?.categoryId ?? '',
            image: currentData?.image ?? '/placeholder.svg',
        },
    })

    const onSubmit = async (data: ProductSchema) => {
        setLoading(true)
        const uploadedImage =
            isUrl(data?.image) || data?.image === '/placeholder.svg'
                ? data?.image
                : await uploadImage(data?.image)

        const { success, message } = await createOrUpdateProduct({
            id: currentData?.id ?? '',
            data: { ...data, image: uploadedImage! },
        })
        setLoading(false)

        if (!success) {
            toast.error(message || 'Terjadi kesalahan')
        }

        if (success) {
            toast.success(message || 'Berhasil')
            back()
        }
    }

    useEffect(() => {
        const fetchCategories = async () => {
            const categories = await getCategoriesList()
            setCategories(categories)
        }
        fetchCategories().then((r) => r)
    }, [])

    return (
        <div>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                <FieldGroup>
                    <Controller
                        name='categoryId'
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldContent>
                                    <FieldLabel htmlFor='categoryId'>
                                        Kategori
                                    </FieldLabel>
                                    {fieldState.invalid && (
                                        <FieldError
                                            errors={[fieldState.error]}
                                        />
                                    )}
                                </FieldContent>
                                <Select
                                    name={field.name}
                                    value={field.value}
                                    onValueChange={field.onChange}
                                >
                                    <SelectTrigger
                                        id='categoryId'
                                        aria-invalid={fieldState.invalid}
                                        className='min-w-[120px]'
                                    >
                                        <SelectValue placeholder='Pilih Kategori' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories?.map((category) => (
                                            <SelectItem
                                                key={category.id}
                                                value={category.id}
                                            >
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </Field>
                        )}
                    />

                    <Controller
                        name='name'
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor='name'>
                                    Nama Produk
                                </FieldLabel>
                                <Input
                                    {...field}
                                    id='name'
                                    aria-invalid={fieldState.invalid}
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

                    <Controller
                        name='description'
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor='description'>
                                    Deskripsi
                                </FieldLabel>
                                <InputGroup>
                                    <InputGroupTextarea
                                        {...field}
                                        id='description'
                                        placeholder='Ini adalah produk ...'
                                        rows={6}
                                        className='min-h-24 resize-none'
                                        aria-invalid={fieldState.invalid}
                                    />
                                    <InputGroupAddon align='block-end'>
                                        <InputGroupText className='tabular-nums'>
                                            {field.value.length}/100 karakter
                                        </InputGroupText>
                                    </InputGroupAddon>
                                </InputGroup>
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

                    <Controller
                        name='price'
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor='price'>Harga</FieldLabel>
                                <InputGroup>
                                    <InputGroupAddon align='inline-start'>
                                        <InputGroupText>Rp</InputGroupText>
                                    </InputGroupAddon>
                                    <InputGroupInput
                                        {...field}
                                        onChange={(e) =>
                                            field.onChange(
                                                Number(e.target.value),
                                            )
                                        }
                                        value={
                                            field.value === 0 ? '' : field.value
                                        }
                                        id='price'
                                        type='number'
                                        aria-invalid={fieldState.invalid}
                                    />
                                </InputGroup>
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

                    <Controller
                        name='image'
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor='image'>Gambar</FieldLabel>
                                <InputImage
                                    value={field.value}
                                    action={(v) => field.onChange(v)}
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                </FieldGroup>
                <Field orientation='horizontal'>
                    <Button disabled={loading} type='submit'>
                        {loading && <Spinner />}
                        Simpan
                    </Button>
                </Field>
            </form>
        </div>
    )
}
