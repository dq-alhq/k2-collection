import { IconMail, IconMapPin, IconPhone } from '@tabler/icons-react'
import MapLocation from '@/app/(guest)/about/map'
import { Mdiv } from '@/components/animated'
import { siteConfig } from '@/config/site'

export default function Contact() {
    return (
        <div className='mx-auto max-w-5xl'>
            <div className='mb-10 text-center'>
                <h2 className='mb-3 font-bold text-3xl sm:text-4xl'>
                    Lokasi & Kontak Kami
                </h2>
                <p className='mx-auto max-w-2xl text-gray-400'>
                    Hubungi atau kunjungi kami di Kantor produksi K2 Collection
                    untuk informasi dan pemesanan order.
                </p>
            </div>

            <div className='overflow-hidden rounded-md border border-white/10 bg-white/5 shadow-xl backdrop-blur-lg'>
                <Mdiv className='h-[350px] w-full'>
                    <MapLocation />
                </Mdiv>
                <Mdiv className='grid grid-cols-1 gap-8 p-8 sm:grid-cols-3'>
                    <div className='flex items-start gap-4'>
                        <IconMapPin className='size-8 text-primary' />
                        <div>
                            <h3 className='mb-1 font-semibold text-lg'>
                                Kantor Produksi
                            </h3>
                            <p className='text-gray-400 text-sm'>
                                {siteConfig.contact.address}
                            </p>
                        </div>
                    </div>

                    <div className='flex items-start gap-4'>
                        <IconPhone className='size-8 text-primary' />
                        <div>
                            <h3 className='mb-1 font-semibold text-lg'>
                                Kontak Kami
                            </h3>
                            <p className='text-gray-400 text-sm'>
                                {siteConfig.contact.phone}
                            </p>
                        </div>
                    </div>

                    <div className='flex items-start gap-4'>
                        <IconMail className='size-8 text-primary' />
                        <div>
                            <h3 className='mb-1 font-semibold text-lg'>
                                Email
                            </h3>
                            <p className='text-gray-400 text-sm'>
                                {siteConfig.contact.email}
                            </p>
                        </div>
                    </div>
                </Mdiv>
            </div>
        </div>
    )
}
