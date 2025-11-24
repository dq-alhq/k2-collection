import AppBreadcrumbs from '@/components/layouts/app-breadcrumbs'
import { AppSidebar } from '@/components/layouts/app-sidebar'
import { ThemeSwitcher } from '@/components/theme-switcher'
import { Separator } from '@/components/ui/separator'
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from '@/components/ui/sidebar'

export default function DashboardLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <SidebarProvider
            style={
                {
                    '--sidebar-width': 'calc(var(--spacing) * 72)',
                    '--header-height': 'calc(var(--spacing) * 14)',
                } as React.CSSProperties
            }
        >
            <AppSidebar variant='inset' />
            <SidebarInset>
                <header className='flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)'>
                    <div className='flex w-full items-center gap-2 px-4'>
                        <SidebarTrigger className='-ml-1' />
                        <Separator
                            orientation='vertical'
                            className='mr-2 data-[orientation=vertical]:h-4'
                        />
                        <AppBreadcrumbs />
                        <div className='ml-auto'>
                            <ThemeSwitcher />
                        </div>
                    </div>
                </header>
                <div className='flex flex-1 flex-col'>{children}</div>
            </SidebarInset>
        </SidebarProvider>
    )
}
