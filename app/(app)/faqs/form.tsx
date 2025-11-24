'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { createOrUpdateFaq } from '@/actions/faq'
import { Button } from '@/components/ui/button'
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from '@/components/ui/field'
import {
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    InputGroupTextarea,
} from '@/components/ui/input-group'
import { Spinner } from '@/components/ui/spinner'
import type { Faq } from '@/lib/generated/prisma/client'
import { type FaqSchema, faqSchema } from '@/lib/zod'

export default function FaqForm({ currentData }: { currentData?: Faq }) {
    const [loading, setLoading] = useState(false)

    const { back } = useRouter()

    const form = useForm<FaqSchema>({
        resolver: zodResolver(faqSchema),
        defaultValues: {
            question: currentData?.question ?? '',
            answer: currentData?.answer ?? '',
        },
    })

    const onSubmit = async (data: FaqSchema) => {
        setLoading(true)
        const { success, message } = await createOrUpdateFaq({
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
                        name='question'
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor='question'>
                                    Pertanyaan
                                </FieldLabel>
                                <InputGroup>
                                    <InputGroupTextarea
                                        {...field}
                                        id='question'
                                        placeholder='Apa/Bagaimana/Berapa ...'
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
                        name='answer'
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor='answer'>
                                    Jawaban
                                </FieldLabel>
                                <InputGroup>
                                    <InputGroupTextarea
                                        {...field}
                                        id='answer'
                                        placeholder='adalah ...'
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
