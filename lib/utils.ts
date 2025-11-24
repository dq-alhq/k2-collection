import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const formatRupiah = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(value)
}

export const isUrl = (string: string) => {
    try {
        const url = new URL(string)
        return url.protocol === 'http:' || url.protocol === 'https:'
    } catch {
        return false
    }
}

export const wait = (time: number, action: void) =>
    new Promise((action) => setTimeout(action, time))

export const parseWhatsapp = (value: string): string => {
    if (value.startsWith('0')) {
        return `62${value.slice(1).replace(/\D/g, '')}`
    } else if (value.startsWith('+62')) {
        return value.replace('+62', '62').replace(/\D/g, '')
    } else {
        return value.replace(/\D/g, '')
    }
}
