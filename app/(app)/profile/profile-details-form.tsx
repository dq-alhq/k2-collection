'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import type { User } from 'better-auth'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { InputImage } from '@/components/upload-image'
import { updateUser } from '@/lib/auth-client'
import { uploadImage } from '@/lib/upload-image'

const updateProfileSchema = z.object({
    name: z.string().trim().min(1, { message: 'Name is required' }),
    image: z.string().optional().nullable(),
})

export type UpdateProfileValues = z.infer<typeof updateProfileSchema>

interface ProfileDetailsFormProps {
    user: User
}

export function ProfileDetailsForm({ user }: ProfileDetailsFormProps) {
    const [status, setStatus] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    const router = useRouter()

    const form = useForm<UpdateProfileValues>({
        resolver: zodResolver(updateProfileSchema),
        defaultValues: {
            name: user?.name ?? '',
            image: user?.image ?? '',
        },
    })

    async function onSubmit({ name, image }: UpdateProfileValues) {
        setStatus(null)
        setError(null)

        const uploadedImage = await uploadImage(image!)

        const { error } = await updateUser({ name, image: uploadedImage })

        if (error) {
            setError(error.message || 'Gagal update profil')
        } else {
            setStatus('Profil berhasil diperbarui')
            router.refresh()
        }
    }

    const loading = form.formState.isSubmitting

    return (
        <Card>
            <CardHeader>
                <CardTitle>Profil</CardTitle>
            </CardHeader>
            <CardContent>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='grid max-w-lg gap-4'
                >
                    <Controller
                        name='name'
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor='name'>Nama</FieldLabel>
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
                        name='image'
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor='image'>Gambar</FieldLabel>
                                <InputImage
                                    value={field.value || ''}
                                    action={(v) => field.onChange(v)}
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

                    {error && (
                        <div role='alert' className='text-red-600 text-sm'>
                            {error}
                        </div>
                    )}
                    {status && (
                        <div role='status' className='text-green-600 text-sm'>
                            {status}
                        </div>
                    )}
                    <Button type='submit' disabled={loading}>
                        {loading && <Spinner />}
                        Save changes
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
