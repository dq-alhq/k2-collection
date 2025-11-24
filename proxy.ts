import { getSessionCookie } from 'better-auth/cookies'
import { type NextRequest, NextResponse } from 'next/server'

// Daftar halaman
const PUBLIC_PAGES = ['/', '/about', '/our-products'] // bebas diakses tanpa login
const GUEST_ONLY_PAGES = ['/sign-in', '/register', '/forgot-password'] // hanya untuk guest
const PROTECTED_PAGES = [
    '/dashboard',
    '/categories',
    '/products',
    '/profile',
    '/faqs',
] // harus login

export async function proxy(request: NextRequest) {
    const sessionCookie = getSessionCookie(request)
    const pathname = request.nextUrl.pathname

    // 1️⃣ Public pages, bisa diakses siapa saja
    if (PUBLIC_PAGES.includes(pathname)) {
        return NextResponse.next()
    }

    // 2️⃣ Guest-only pages
    if (GUEST_ONLY_PAGES.includes(pathname) && sessionCookie) {
        // Kalau sudah login, redirect ke dashboard
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // 3️⃣ Protected pages
    if (PROTECTED_PAGES.some((path) => pathname.startsWith(path))) {
        if (!sessionCookie) {
            return NextResponse.redirect(new URL('/sign-in', request.url))
        }
        return NextResponse.next()
    }

    // 4️⃣ Default: biarkan request berjalan
    return NextResponse.next()
}

// matcher: cek semua path yang penting, plus guest pages
export const config = {
    matcher: [
        '/dashboard/:path*',
        '/categories/:path*',
        '/products/:path*',
        '/profile/:path*',
        '/sign-in',
        '/register',
        '/forgot-password',
        '/faqs',
    ],
}
