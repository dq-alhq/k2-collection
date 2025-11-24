'use client'

import {
    IconDashboard,
    IconLogin,
    IconLogout,
    IconUser,
} from '@tabler/icons-react'
import { ChevronsUpDown, LogOut } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { buttonVariants } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar'
import { Skeleton } from '@/components/ui/skeleton'
import { useIsMobile } from '@/hooks/use-mobile'
import { signOut, useSession } from '@/lib/auth-client'

export function NavUser() {
    const { isMobile } = useSidebar()
    const { data: session, isPending } = useSession()

    const user = session?.user

    const handleSignOut = async () => {
        await signOut()
        redirect('/')
    }

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                {isPending || !user ? (
                    <div className='flex w-full items-center gap-2'>
                        <Skeleton className='h-8 w-8 rounded-lg border' />
                        <div className='grid flex-1 gap-0.5 text-left text-sm leading-tight'>
                            <Skeleton className='h-4 w-40 rounded-lg border' />
                            <Skeleton className='h-3 w-24 rounded-lg border' />
                        </div>
                    </div>
                ) : (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <SidebarMenuButton
                                size='lg'
                                className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
                            >
                                <Avatar className='h-8 w-8 rounded-lg border'>
                                    <AvatarImage
                                        src={user?.image || ''}
                                        alt={user?.name}
                                    />
                                    <AvatarFallback className='rounded-lg'>
                                        <IconUser />
                                    </AvatarFallback>
                                </Avatar>
                                <div className='grid flex-1 text-left text-sm leading-tight'>
                                    <span className='truncate font-medium'>
                                        {user?.name}
                                    </span>
                                    <span className='truncate text-xs'>
                                        {user?.email}
                                    </span>
                                </div>
                                <ChevronsUpDown className='ml-auto size-4' />
                            </SidebarMenuButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
                            side={isMobile ? 'bottom' : 'right'}
                            align='end'
                            sideOffset={4}
                        >
                            <DropdownMenuLabel className='p-0 font-normal'>
                                <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                                    <Avatar className='size-8 rounded-lg'>
                                        <AvatarImage
                                            src={user?.image || ''}
                                            alt={user?.name}
                                        />
                                        <AvatarFallback className='rounded-lg'>
                                            <IconUser />
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className='grid flex-1 text-left text-sm leading-tight'>
                                        <span className='truncate font-medium'>
                                            {user?.name}
                                        </span>
                                        <span className='truncate text-xs'>
                                            {user?.email}
                                        </span>
                                    </div>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href='/profile'>
                                    <IconUser />
                                    Profil
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleSignOut}>
                                <LogOut />
                                Log out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </SidebarMenuItem>
        </SidebarMenu>
    )
}

export function NavbarUser() {
    const { data: session, isPending } = useSession()
    const isMobile = useIsMobile()
    const handleSignOut = async () => {
        await signOut()
        redirect('/')
    }

    if (isPending) return <Skeleton className='size-9 rounded-lg' />

    return session?.user ? (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar className='size-9 rounded-lg border'>
                    <AvatarImage
                        src={session?.user?.image || ''}
                        alt={session?.user?.name}
                    />
                    <AvatarFallback className='rounded-lg'>
                        <IconUser />
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='min-w-56' align='end' side='bottom'>
                <DropdownMenuLabel className='p-0 font-normal'>
                    <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                        <Avatar className='size-8 rounded-lg'>
                            <AvatarImage
                                src={session?.user?.image || ''}
                                alt={session?.user?.name}
                            />
                            <AvatarFallback className='rounded-lg'>
                                <IconUser />
                            </AvatarFallback>
                        </Avatar>
                        <div className='grid flex-1 text-left text-sm leading-tight'>
                            <span className='truncate font-medium'>
                                {session?.user?.name}
                            </span>
                            <span className='truncate text-xs'>
                                {session?.user?.email}
                            </span>
                        </div>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href='/dashboard'>
                        <IconDashboard />
                        Dashboard
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href='/profile'>
                        <IconUser />
                        Profil
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                    <IconLogout />
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    ) : (
        <Link
            href='/sign-in'
            className={buttonVariants({ variant: 'outline' })}
        >
            <IconLogin />
            Login
        </Link>
    )
}
