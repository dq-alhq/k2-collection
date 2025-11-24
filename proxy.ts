import { getSessionCookie } from 'better-auth/cookies'
import { type NextRequest, NextResponse } from 'next/server'

export async function proxy(request: NextRequest) {
    const sessionCookie = getSessionCookie(request)

    if (!sessionCookie) {
        return NextResponse.redirect(new URL('/sign-in', request.url))
    }

    if (sessionCookie && request.nextUrl.pathname === '/sign-in') {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/categories/:path*',
        '/products/:path*',
        '/profile/:path*',
        '/sign-in',
    ],
}
