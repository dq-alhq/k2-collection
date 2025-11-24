'use client'

import {
    IconDashboard,
    IconLayout,
    IconPackage,
    IconUser,
} from '@tabler/icons-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type * as React from 'react'
import { useEffect } from 'react'
import { AppLogo } from '@/components/app-logo'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    useSidebar,
} from '@/components/ui/sidebar'
import { siteConfig } from '@/config/site'
import { NavUser } from './nav-user'

// This is sample data.
const data = {
    main: [
        {
            name: 'Dashboard',
            url: '/dashboard',
            icon: IconDashboard,
        },
    ],
    management: [
        {
            name: 'Kategori Produk',
            url: '/categories',
            icon: IconLayout,
        },
        {
            name: 'Produk',
            url: '/products',
            icon: IconPackage,
        },
    ],
    tentang: [
        {
            name: 'Profil',
            url: '/profile',
            icon: IconUser,
        },
    ],
}

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
    const pathname = usePathname()
    const { setOpenMobile } = useSidebar()
    useEffect(() => {
        setOpenMobile(false)
    }, [pathname])

    return (
        <Sidebar collapsible='icon' {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size='lg' asChild>
                            <Link href='/' className='flex items-center'>
                                <div className='flex aspect-square size-8 shrink-0 items-center justify-center rounded-lg bg-white p-1 shadow-sm'>
                                    <AppLogo />
                                </div>
                                <div className='grid flex-1 text-left text-sm data-[state=close]:hidden'>
                                    <span className='truncate font-bold text-sm'>
                                        {siteConfig.name}
                                    </span>
                                    <span className='truncate text-xs'>
                                        Dashboard
                                    </span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu>
                        {data.main.map((item) => (
                            <SidebarMenuItem
                                className={
                                    pathname === item.url
                                        ? 'rounded-lg bg-sidebar-accent text-sidebar-accent-foreground'
                                        : ''
                                }
                                key={item.name}
                            >
                                <SidebarMenuButton asChild tooltip={item.name}>
                                    <Link href={item.url}>
                                        <item.icon />
                                        <span>{item.name}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>Manajemen Produk</SidebarGroupLabel>
                    <SidebarMenu>
                        {data.management.map((item) => (
                            <SidebarMenuItem
                                className={
                                    pathname.includes(item.url)
                                        ? 'rounded-lg bg-sidebar-accent text-sidebar-accent-foreground'
                                        : ''
                                }
                                key={item.name}
                            >
                                <SidebarMenuButton asChild tooltip={item.name}>
                                    <Link href={item.url}>
                                        <item.icon />
                                        <span>{item.name}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
                <SidebarGroup className='mt-auto'>
                    <SidebarMenu>
                        {data.tentang.map((item) => (
                            <SidebarMenuItem
                                className={
                                    pathname.includes(item.url)
                                        ? 'rounded-lg bg-sidebar-accent text-sidebar-accent-foreground'
                                        : ''
                                }
                                key={item.name}
                            >
                                <SidebarMenuButton asChild tooltip={item.name}>
                                    <Link href={item.url}>
                                        <item.icon />
                                        <span>{item.name}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
