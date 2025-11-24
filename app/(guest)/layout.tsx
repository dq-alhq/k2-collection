import Footer from '@/components/layouts/footer'
import { Navbar } from '@/components/layouts/navbar'

export default function GuestLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <Navbar />
            {children}
            <Footer />
        </>
    )
}
