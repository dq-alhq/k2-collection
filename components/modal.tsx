'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet'

export function Modal({
    title,
    description,
    children,
    type = 'sheet',
}: {
    title: string
    description: string
    children: React.ReactNode
    type?: 'modal' | 'sheet'
}) {
    const router = useRouter()
    const [open, setOpen] = useState(true)

    function onDismiss() {
        setOpen(false)
        setTimeout(() => {
            router.back()
        }, 300)
    }

    return type === 'modal' ? (
        <Dialog open={open} onOpenChange={onDismiss}>
            <DialogTrigger className='sr-only' />
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                {children}
            </DialogContent>
        </Dialog>
    ) : (
        <Sheet open={open} onOpenChange={onDismiss}>
            <SheetTrigger className='sr-only' />
            <SheetContent className='overflow-y-auto'>
                <SheetHeader>
                    <SheetTitle>{title}</SheetTitle>
                    <SheetDescription>{description}</SheetDescription>
                </SheetHeader>
                {children}
            </SheetContent>
        </Sheet>
    )
}
