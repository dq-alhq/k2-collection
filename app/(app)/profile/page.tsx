import type { Metadata } from 'next'
import { unauthorized } from 'next/navigation'
import { getServerSession } from '@/lib/get-session'
import { EmailForm } from './email-form'
import { LogoutEverywhereButton } from './logout-everywhere-button'
import { PasswordForm } from './password-form'
import { ProfileDetailsForm } from './profile-details-form'

export const metadata: Metadata = {
    title: 'Profile',
}

export default async function ProfilePage() {
    const session = await getServerSession()
    const user = session?.user

    if (!user) unauthorized()

    return (
        <div className='space-y-4 py-4 md:py-6'>
            <div className='flex justify-between p-4 md:px-6'>
                <div>
                    <h1 className='font-bold text-2xl'>Informasi Profil</h1>
                    <p className='text-muted-foreground text-sm'>
                        Berikut adalah informasi anda, Anda dapat mengubah
                        informasi tersebut di sini.
                    </p>
                </div>
            </div>
            <div className='flex flex-col gap-6 px-4 md:px-6'>
                <ProfileDetailsForm user={user} />
                <EmailForm currentEmail={user.email} />
                <PasswordForm />
                <LogoutEverywhereButton />
            </div>
        </div>
    )
}
