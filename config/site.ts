export type SiteConfig = typeof siteConfig

export const siteConfig = {
    name: 'K2 Collection',
    description:
        'Jasa Konveksi & Custom Clothing Berkualitas. Menerima pembuatan pakaian custom untuk kebutuhan komunitas, sekolah, perusahaan, event, dan instansi lainnya.',
    navItems: [
        {
            label: 'Home',
            href: '/',
        },
        {
            label: 'Produk',
            href: '/our-product',
        },
        {
            label: 'Tentang Kami',
            href: '/about',
        },
    ],
    navMenuItems: [
        {
            label: 'Dashboard',
            href: '/dashboard',
        },
        {
            label: 'Profile',
            href: '/profile',
        },
        {
            label: 'Produk',
            href: '/products',
        },
        {
            label: 'Kategori',
            href: '/categories',
        },
        {
            label: 'Settings',
            href: '/settings',
        },
        {
            label: 'Logout',
            href: '/logout',
        },
    ],
    links: {
        github: 'https://github.com/dq-alhq',
        twitter: 'https://x.com/dq.alhaqqi',
        docs: 'https://k2-collection.vercel.app',
    },
}
