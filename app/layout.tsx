import type { Metadata, Viewport } from 'next'
import './globals.css'
import Script from 'next/script'
import ChatbotWidget from '@/components/layouts/chat'
import { Providers } from '@/components/providers'
import { FontMono, FontSans } from '@/config/fonts'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
    metadataBase: new URL(
        process.env.NEXT_PUBLIC_BASE_URL ?? 'https://k2-collection.vercel.app',
    ),
    title: {
        default: siteConfig.name,
        template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description,
    alternates: {
        canonical: '/',
    },
    keywords: ['konveksi', 'jasa kaos', 'pemesanan kaos', 'baju', 'pakaian'],
    authors: [
        {
            name: 'K2 Collection',
            url: 'https://k2-collection.vercel.app',
        },
    ],
    creator: 'K2 Collection',
}

export const viewport: Viewport = {
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: 'white' },
        { media: '(prefers-color-scheme: dark)', color: 'black' },
    ],
    viewportFit: 'cover',
    width: 'device-width',
    initialScale: 1,
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html
            lang='id'
            suppressHydrationWarning
            data-scroll-behavior='smooth'
            className={`${FontSans.variable} ${FontMono.variable}`}
        >
            <head>
                <Script
                    src='https://www.googletagmanager.com/gtag/js?id=AW-17524467920'
                    strategy='afterInteractive'
                />
                <Script id='google-analytics' strategy='afterInteractive'>
                    {`
                       window.dataLayer = window.dataLayer || [];
                       function gtag(){dataLayer.push(arguments);}
                       gtag('js', new Date());
                       gtag('config', 'AW-17524467920');
                     `}
                </Script>
            </head>
            <body className='font-sans antialiased'>
                <Providers>
                    {children}
                    <ChatbotWidget />
                </Providers>
            </body>
        </html>
    )
}
