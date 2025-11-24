'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import z from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { changeEmail } from '@/lib/auth-client'

export const updateEmailSchema = z.object({
    newEmail: z.email({ message: 'Enter a valid email' }),
})

export type UpdateEmailValues = z.infer<typeof updateEmailSchema>

interface EmailFormProps {
    currentEmail: string
}

export function EmailForm({ currentEmail }: EmailFormProps) {
    const [status, setStatus] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    const form = useForm<UpdateEmailValues>({
        resolver: zodResolver(updateEmailSchema),
        defaultValues: {
            newEmail: currentEmail,
        },
    })

    async function onSubmit({ newEmail }: UpdateEmailValues) {
        setStatus(null)
        setError(null)

        const { error } = await changeEmail({
            newEmail,
            callbackURL: '/email-verified',
        })

        if (error) {
            setError(error.message || 'Failed to initiate email change')
        } else {
            setStatus('Verification email sent to your current address')
        }
    }

    const loading = form.formState.isSubmitting

    return (
        <Card>
            <CardHeader>
                <CardTitle>Ubah Email</CardTitle>
            </CardHeader>
            <CardContent>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='grid max-w-lg gap-4'
                >
                    <Controller
                        name='newEmail'
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor='email'>Email</FieldLabel>
                                <Input
                                    {...field}
                                    aria-invalid={fieldState.invalid}
                                    id='email'
                                    type='email'
                                    placeholder='m@example.com'
                                    required
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

                    {error && (
                        <div role='alert' className='text-destructive text-sm'>
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
                        Simpan
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
