'use client'
import { usePathname } from 'next/navigation'
import { Fragment } from 'react'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { useIsMobile } from '@/hooks/use-mobile'

export default function AppBreadcrumbs() {
    const pathname = usePathname()
    const segments = pathname.split('/').filter(Boolean)
    const isMobile = useIsMobile()

    const breadcrumbs = segments.map((segment, index) => {
        const href = `/${segments.slice(0, index + 1).join('/')}`
        const name = segment
            .split('-')
            .map((word) => {
                if (!word) {
                    return '' // Handle empty strings that might result from multiple hyphens
                }
                return (
                    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                )
            })
            .join(' ')

        return { name, href }
    })
    return (
        <Breadcrumb>
            <BreadcrumbList>
                {!isMobile ? (
                    breadcrumbs.map((item, index) => (
                        <Fragment key={index}>
                            <BreadcrumbItem>
                                {index < breadcrumbs.length - 1 ? (
                                    <BreadcrumbLink href={item.href}>
                                        {item.name}
                                    </BreadcrumbLink>
                                ) : (
                                    <BreadcrumbPage>{item.name}</BreadcrumbPage>
                                )}
                            </BreadcrumbItem>
                            {index < breadcrumbs.length - 1 && (
                                <BreadcrumbSeparator />
                            )}
                        </Fragment>
                    ))
                ) : (
                    <BreadcrumbItem>
                        <BreadcrumbPage>
                            {breadcrumbs[breadcrumbs.length - 1].name}
                        </BreadcrumbPage>
                    </BreadcrumbItem>
                )}
            </BreadcrumbList>
        </Breadcrumb>
    )
}
