import localFont from 'next/font/local'

export const FontSans = localFont({
    src: './fonts/geist.woff2',
    variable: '--font-sans',
    display: 'swap',
})

export const FontMono = localFont({
    src: './fonts/geist-mono.woff2',
    variable: '--font-mono',
    display: 'swap',
})
