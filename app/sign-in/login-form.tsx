'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import {
    IconBrandFacebook,
    IconBrandInstagram,
    IconBrandWhatsapp,
} from '@tabler/icons-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'
import { PasswordInput } from '@/components/password-input'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldSet,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { signIn } from '@/lib/auth-client'
import { cn } from '@/lib/utils'

const signInSchema = z.object({
    email: z.email({ message: 'Please enter a valid email' }),
    password: z.string().min(1, { message: 'Password is required' }),
    rememberMe: z.boolean().optional(),
})

type SignInValues = z.infer<typeof signInSchema>

export function LoginForm({
    className,
    ...props
}: React.ComponentProps<'div'>) {
    const [loading, setLoading] = useState(false)

    const { push } = useRouter()

    const form = useForm<SignInValues>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: '',
            password: '',
            rememberMe: false,
        },
    })

    async function onSubmit({ email, password, rememberMe }: SignInValues) {
        setLoading(true)
        const { error } = await signIn.email({
            email,
            password,
            rememberMe,
        })

        setLoading(false)

        if (error) {
            toast.error(error?.message || 'Terjadi kesalahan')
        }

        if (!error) {
            toast.success('Berhasil Login')
            push('/dashboard')
        }
    }

    return (
        <div className={cn('flex flex-col gap-6', className)} {...props}>
            <Card className='overflow-hidden p-0'>
                <CardContent className='grid p-0 md:grid-cols-2'>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='p-6 md:p-8'
                    >
                        <Link
                            href={'/'}
                            className='mb-2 flex items-center justify-center gap-2 rounded-lg text-primary'
                        >
                            <span className='font-bold text-3xl tracking-tighter'>
                                K2 COLLECTION
                            </span>
                        </Link>
                        <div className='mb-6 flex justify-center space-x-2'>
                            <Link
                                href='#'
                                className={buttonVariants({
                                    size: 'icon',
                                    variant: 'outline',
                                })}
                            >
                                <IconBrandFacebook />
                            </Link>
                            <Link
                                href='#'
                                className={buttonVariants({
                                    size: 'icon',
                                    variant: 'outline',
                                })}
                            >
                                <IconBrandInstagram />
                            </Link>
                            <Link
                                href='#'
                                className={buttonVariants({
                                    size: 'icon',
                                    variant: 'outline',
                                })}
                            >
                                <IconBrandWhatsapp />
                            </Link>
                        </div>

                        <FieldGroup>
                            <div className='flex flex-col items-center gap-2 text-center'>
                                <p className='text-balance text-muted-foreground'>
                                    Masukkan email dan password untuk masuk
                                </p>
                            </div>
                            <Controller
                                name='email'
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor='email'>
                                            Email
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            aria-invalid={fieldState.invalid}
                                            id='email'
                                            type='email'
                                            placeholder='m@example.com'
                                            required
                                        />
                                        {fieldState.invalid && (
                                            <FieldError
                                                errors={[fieldState.error]}
                                            />
                                        )}
                                    </Field>
                                )}
                            />
                            <Controller
                                name='password'
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor='password'>
                                            Password
                                        </FieldLabel>
                                        <PasswordInput
                                            {...field}
                                            aria-invalid={fieldState.invalid}
                                            id='password'
                                            required
                                        />
                                        {fieldState.invalid && (
                                            <FieldError
                                                errors={[fieldState.error]}
                                            />
                                        )}
                                    </Field>
                                )}
                            />
                            <Controller
                                name='rememberMe'
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <FieldSet data-invalid={fieldState.invalid}>
                                        <FieldGroup data-slot='checkbox-group'>
                                            <Field orientation='horizontal'>
                                                <Checkbox
                                                    id='rememberMe'
                                                    name={field.name}
                                                    checked={field.value}
                                                    onCheckedChange={
                                                        field.onChange
                                                    }
                                                />
                                                <FieldLabel
                                                    htmlFor='rememberMe'
                                                    className='font-normal'
                                                >
                                                    Ingat saya
                                                </FieldLabel>
                                            </Field>
                                        </FieldGroup>
                                        {fieldState.invalid && (
                                            <FieldError
                                                errors={[fieldState.error]}
                                            />
                                        )}
                                    </FieldSet>
                                )}
                            />
                            <Field>
                                <Button disabled={loading} type='submit'>
                                    {loading && <Spinner />}
                                    Login
                                </Button>
                            </Field>
                        </FieldGroup>
                    </form>
                    <div className='relative hidden md:block'>
                        <div className='absolute z-40 mt-32 flex h-full flex-col items-center gap-4 text-center text-white'>
                            <h2 className='font-bold text-2xl'>
                                K2 Collection
                            </h2>
                            <p className='mx-auto px-10 leading-relaxed'>
                                Jasa Konveksi & Custom Clothing Berkualitas.
                                Menerima pembuatan pakaian custom untuk
                                kebutuhan komunitas, sekolah, perusahaan, event,
                                dan instansi lainnya.
                            </p>
                        </div>
                        <Image
                            src='/images/banner1.jpg'
                            alt='Banner 1'
                            className='size-full object-cover'
                            width={1036}
                            height={643}
                            priority
                        />

                        <div className='absolute inset-0 bg-black/60' />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
