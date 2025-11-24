'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { revokeSessions } from '@/lib/auth-client'

export function LogoutEverywhereButton() {
    const [loading, setLoading] = useState(false)

    const router = useRouter()

    async function handleLogoutEverywhere() {
        setLoading(true)
        const { error } = await revokeSessions()
        setLoading(false)

        if (error) {
            toast.error(error.message || 'Gagal logout semua perangkat')
        } else {
            toast.success('Berhasil logout dari semua perangkat')
            router.push('/sign-in')
        }
    }

    return (
        <Button
            variant='destructive'
            onClick={handleLogoutEverywhere}
            disabled={loading}
            className='w-full'
        >
            {loading && <Spinner />}
            Logout Semua Perangkat
        </Button>
    )
}
