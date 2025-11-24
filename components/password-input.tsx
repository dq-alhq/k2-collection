'use client'

import { IconEye, IconEyeClosed } from '@tabler/icons-react'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
export function PasswordInput({
    className,
    ...props
}: React.ComponentProps<typeof Input>) {
    const [showPassword, setShowPassword] = useState(false)

    return (
        <div className='relative'>
            <Input
                type={showPassword ? 'text' : 'password'}
                className={cn('pr-10 [&::-ms-reveal]:hidden', className)}
                {...props}
            />
            <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Hide password' : 'Show password'}
                className='-translate-y-1/2 absolute top-1/2 right-3 transform text-muted-foreground hover:text-foreground'
            >
                {showPassword ? (
                    <IconEye className='size-5' />
                ) : (
                    <IconEyeClosed className='size-5' />
                )}
            </button>
        </div>
    )
}
