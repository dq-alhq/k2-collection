'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type z from 'zod'
import { createOrUpdateCategory } from '@/actions/category'
import { Button } from '@/components/ui/button'
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import type { Category } from '@/lib/generated/prisma/client'
import { categorySchema } from '@/lib/zod'

export default function CategoryForm({
    currentData,
}: {
    currentData?: Category
}) {
    const [loading, setLoading] = useState(false)

    const { back } = useRouter()

    const form = useForm<z.infer<typeof categorySchema>>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name: currentData?.name ?? '',
        },
    })

    const onSubmit = async (data: z.infer<typeof categorySchema>) => {
        setLoading(true)
        const { success, message } = await createOrUpdateCategory({
            id: currentData?.id ?? '',
            data,
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

    return (
        <div>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                <FieldGroup>
                    <Controller
                        name='name'
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor='name'>
                                    Nama Kategori
                                </FieldLabel>
                                <Input
                                    {...field}
                                    id='name'
                                    aria-invalid={fieldState.invalid}
                                    autoComplete='username'
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
