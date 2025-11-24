'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { PasswordInput } from '@/components/password-input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'
import { changePassword } from '@/lib/auth-client'
import { passwordSchema } from '@/lib/zod'

const updatePasswordSchema = z.object({
    currentPassword: z
        .string()
        .min(1, { message: 'Current password is required' }),
    newPassword: passwordSchema,
})

type UpdatePasswordValues = z.infer<typeof updatePasswordSchema>

export function PasswordForm() {
    const [status, setStatus] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    const form = useForm<UpdatePasswordValues>({
        resolver: zodResolver(updatePasswordSchema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
        },
    })

    async function onSubmit({
        currentPassword,
        newPassword,
    }: UpdatePasswordValues) {
        setStatus(null)
        setError(null)

        const { error } = await changePassword({
            currentPassword,
            newPassword,
            revokeOtherSessions: true,
        })

        if (error) {
            setError(error.message || 'Gagal ubah password')
        } else {
            setStatus('Password berhasil diubah')
            form.reset()
        }
    }

    const loading = form.formState.isSubmitting

    return (
        <Card>
            <CardHeader>
                <CardTitle>Ubah Password</CardTitle>
            </CardHeader>
            <CardContent>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='grid max-w-lg gap-4'
                >
                    <Controller
                        name='currentPassword'
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor='currentPassword'>
                                    Password
                                </FieldLabel>
                                <PasswordInput
                                    {...field}
                                    aria-invalid={fieldState.invalid}
                                    id='currentPassword'
                                    required
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                    <Controller
                        name='newPassword'
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor='newPassword'>
                                    Password Baru
                                </FieldLabel>
                                <PasswordInput
                                    {...field}
                                    aria-invalid={fieldState.invalid}
                                    id='newPassword'
                                    required
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
                        Ubah password
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
