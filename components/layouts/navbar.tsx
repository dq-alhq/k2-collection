'use client'

import {
    IconBuilding,
    IconHome,
    IconMenu2,
    IconPackage,
} from '@tabler/icons-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { NavbarUser } from '@/components/layouts/nav-user'
import { ThemeSwitcher } from '@/components/theme-switcher'
import { Button } from '@/components/ui/button'
import {
    Drawer,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '@/components/ui/drawer'
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from '@/components/ui/navigation-menu'

interface MenuItem {
    title: string
    url: string
    description?: string
    icon?: React.ReactNode
}

interface NavbarProps {
    menu?: MenuItem[]
}

export const Navbar = ({
    menu = [
        { title: 'Home', url: '/', icon: <IconHome /> },
        {
            title: 'Produk',
            url: '/our-products',
            icon: <IconPackage />,
        },
        {
            title: 'Tentang Kami',
            url: '/about',
            icon: <IconBuilding />,
        },
    ],
}: NavbarProps) => {
    const pathname = usePathname()
    const [open, setOpen] = useState(false)
    useEffect(() => {
        setOpen(false)
    }, [pathname])

    return (
        <section className='sticky top-0 z-50 w-full bg-background/90 shadow-lg backdrop-blur supports-[backdrop-filter]:backdrop-blur-2xl'>
            <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
                {/* Desktop Menu */}
                <nav className='hidden h-16 items-center justify-between lg:flex'>
                    <div className='flex items-center gap-6'>
                        {/* Logo */}
                        <Link href={'/'} className='flex items-center gap-2'>
                            <span className='font-bold text-xl tracking-tighter'>
                                K2 COLLECTION
                            </span>
                        </Link>
                        <div className='flex items-center'>
                            <NavigationMenu>
                                <NavigationMenuList className='gap-2'>
                                    {menu.map((item) =>
                                        renderMenuItem(item, pathname),
                                    )}
                                </NavigationMenuList>
                            </NavigationMenu>
                        </div>
                    </div>
                    <div className='flex gap-2'>
                        <ThemeSwitcher />
                        <NavbarUser />
                    </div>
                </nav>

                {/* Mobile Menu */}
                <div className='block lg:hidden'>
                    <div className='flex h-16 items-center justify-between'>
                        {/* Logo */}
                        <Link href={'/'} className='flex items-center gap-2'>
                            <span className='font-bold text-xl tracking-tighter'>
                                K2 COLLECTION
                            </span>
                        </Link>
                        <div className='flex items-center gap-2'>
                            <ThemeSwitcher />
                            <Drawer
                                open={open}
                                onOpenChange={setOpen}
                                direction='top'
                            >
                                <DrawerTrigger asChild>
                                    <Button variant='outline' size='icon'>
                                        <IconMenu2 />
                                    </Button>
                                </DrawerTrigger>
                                <DrawerContent className='overflow-y-auto'>
                                    <DrawerHeader>
                                        <DrawerTitle>
                                            <Link
                                                href={'/'}
                                                className='flex items-center gap-2'
                                            >
                                                <span className='font-bold text-xl tracking-tighter'>
                                                    K2 COLLECTION
                                                </span>
                                            </Link>
                                        </DrawerTitle>
                                    </DrawerHeader>
                                    <div className='flex flex-col gap-6 p-4'>
                                        {menu.map((item) =>
                                            renderMobileMenuItem(
                                                item,
                                                pathname,
                                            ),
                                        )}
                                    </div>
                                    <DrawerFooter>
                                        <NavbarUser />
                                    </DrawerFooter>
                                </DrawerContent>
                            </Drawer>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

const renderMenuItem = (item: MenuItem, pathname: string) => {
    return (
        <NavigationMenuItem key={item.title}>
            <NavigationMenuLink
                href={item.url}
                className={`group inline-flex w-max items-center justify-center rounded-md bg-background px-4 py-2 font-medium text-sm transition hover:scale-105 ${
                    pathname === item.url
                        ? 'bg-accent text-accent-foreground'
                        : ''
                }`}
            >
                {item.title}
            </NavigationMenuLink>
        </NavigationMenuItem>
    )
}

const renderMobileMenuItem = (item: MenuItem, pathname: string) => {
    return (
        <Link
            key={item.title}
            href={item.url}
            className={`font-semibold text-md ${
                pathname === item.url ? 'text-primary' : ''
            }`}
        >
            {item.title}
        </Link>
    )
}
