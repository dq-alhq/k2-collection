'use client'

import { IconAlertCircle, IconArrowLeft, IconHome } from '@tabler/icons-react'
import { motion } from 'motion/react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function ErrorPage() {
    const goBack = () => {
        window.history.back()
    }

    const goHome = () => {
        window.location.href = '/'
    }

    return (
        <motion.div
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className='mx-auto flex h-screen w-full max-w-md flex-col justify-center text-center'
        >
            <div className='mb-8 flex justify-center'>
                <motion.div
                    animate={{ scale: 1, opacity: 1 }}
                    className='flex items-center justify-center rounded-full'
                    initial={{ scale: 0.8, opacity: 0 }}
                    transition={{
                        delay: 0.2,
                        duration: 0.5,
                        ease: [0.16, 1, 0.3, 1],
                    }}
                >
                    <IconAlertCircle
                        aria-hidden='true'
                        className='size-32 text-destructive'
                    />
                </motion.div>
            </div>

            <motion.div
                animate={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 10 }}
                transition={{
                    delay: 0.3,
                    duration: 0.5,
                    ease: [0.16, 1, 0.3, 1],
                }}
            >
                <h1 className='mb-2 font-bold text-4xl text-destructive'>
                    404
                </h1>
                <h2 className='mb-4 font-semibold text-2xl text-destructive'>
                    NOT FOUND
                </h2>
                <p className='mx-auto mb-8 max-w-sm text-muted-foreground'>
                    Halaman yang anda cari tidak ditemukan atau telah dihapus
                </p>
            </motion.div>

            <motion.div
                animate={{ opacity: 1, y: 0 }}
                className='mx-6 flex flex-col justify-center gap-3 sm:flex-row'
                initial={{ opacity: 0, y: 10 }}
                transition={{
                    delay: 0.4,
                    duration: 0.5,
                    ease: [0.16, 1, 0.3, 1],
                }}
            >
                <Button
                    className='transition-all duration-200 ease-out hover:scale-[1.02] active:scale-[0.98]'
                    variant='outline'
                    onClick={goBack}
                >
                    <IconArrowLeft className='size-4' />
                    Go Back
                </Button>
                <Button
                    className='transition-all duration-200 ease-out hover:scale-[1.02] active:scale-[0.98]'
                    onClick={goHome}
                >
                    <IconHome className='size-4' />
                    Go Home
                </Button>
            </motion.div>

            <motion.div
                animate={{ opacity: 1 }}
                className='mt-12 text-default text-sm'
                initial={{ opacity: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
            >
                <p>
                    Butuh bantuan?{' '}
                    <Link
                        className='text-primary underline transition-colors hover:text-primary-600'
                        href='#'
                    >
                        Contact Support
                    </Link>
                </p>
            </motion.div>
        </motion.div>
    )
}
