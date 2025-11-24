'use client'

import { IconMoon, IconSun } from '@tabler/icons-react'
import { useTheme } from 'next-themes'
import type { ComponentProps } from 'react'
import { Button } from '@/components/ui/button'

export function ThemeSwitcher({
    variant = 'outline',
    size = 'icon',
}: ComponentProps<typeof Button>) {
    const { setTheme, resolvedTheme } = useTheme()

    return (
        <Button
            variant={variant}
            size={size}
            onClick={() =>
                setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
            }
        >
            <IconSun className='dark:-rotate-90 size-[1.2rem] rotate-0 scale-100 transition-all dark:scale-0' />
            <IconMoon className='absolute size-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
            <span className='sr-only'>Toggle theme</span>
        </Button>
    )
}
