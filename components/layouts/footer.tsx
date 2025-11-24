import {
    IconBrandFacebook,
    IconBrandInstagram,
    IconBrandWhatsapp,
    IconMail,
    IconMapPin,
    IconPhone,
} from '@tabler/icons-react'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'

export default function Footer() {
    return (
        <footer className='bg-foreground py-10 text-muted'>
            <div className='mx-auto max-w-7xl px-6 lg:px-8'>
                <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
                    <div>
                        <div className='mb-4 flex items-center space-x-3'>
                            <Link
                                href={'/'}
                                className='flex items-center gap-2'
                            >
                                <span className='font-bold text-xl tracking-tighter'>
                                    K2 COLLECTION
                                </span>
                            </Link>
                        </div>
                        <p className='text-muted-foreground text-sm leading-relaxed'>
                            Jasa Konveksi & Custom Clothing Berkualitas.
                            Menerima pembuatan pakaian custom untuk kebutuhan
                            komunitas, sekolah, perusahaan, event, dan instansi
                            lainnya.
                        </p>
                    </div>

                    <div>
                        <h3 className='mb-4 font-semibold text-background text-lg'>
                            Navigasi
                        </h3>
                        <ul className='space-y-2 text-sm'>
                            <li>
                                <Link
                                    href='/'
                                    className='transition hover:text-primary'
                                >
                                    Beranda
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href='/our-product'
                                    className='transition hover:text-primary'
                                >
                                    Produk
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href='/about'
                                    className='transition hover:text-primary'
                                >
                                    Tentang Kami
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className='mb-4 font-semibold text-lg text-primary-foreground'>
                            Hubungi Kami
                        </h3>
                        <ul className='space-y-2 text-muted-foreground text-sm *:[li]:flex *:[li]:items-center *:[li]:gap-2 **:[svg]:size-4 **:[svg]:text-primary'>
                            <li>
                                <IconMapPin />
                                Rt.1b RW.1 Doudo, Panceng, Gresik
                            </li>
                            <li>
                                <IconMail />
                                k2colletion@gmail.com
                            </li>
                            <li>
                                <IconPhone />
                                0856-4507-5556
                            </li>
                        </ul>

                        <div className='mt-4 flex space-x-4'>
                            <Link
                                href='#'
                                className={buttonVariants({
                                    size: 'icon-sm',
                                    variant: 'ghost',
                                })}
                            >
                                <IconBrandFacebook />
                            </Link>
                            <Link
                                href='#'
                                className={buttonVariants({
                                    size: 'icon-sm',
                                    variant: 'ghost',
                                })}
                            >
                                <IconBrandInstagram />
                            </Link>
                            <Link
                                href='#'
                                className={buttonVariants({
                                    size: 'icon-sm',
                                    variant: 'ghost',
                                })}
                            >
                                <IconBrandWhatsapp />
                            </Link>
                        </div>
                    </div>
                </div>
                <div className='mt-10 border-t border-t-muted-foreground pt-6 text-center text-sm'>
                    © {new Date().getFullYear()} K2 Collection. All rights
                    reserved.
                </div>
            </div>
        </footer>
    )
}
