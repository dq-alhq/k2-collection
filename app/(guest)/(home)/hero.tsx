import SearchProduct from '@/app/(guest)/search-product'
import { Mdiv } from '@/components/animated'
import { siteConfig } from '@/config/site'

export default function Hero() {
    return (
        <Mdiv className='relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-white'>
            <h1 className='font-bold text-4xl tracking-tight sm:text-5xl'>
                {siteConfig.name}
            </h1>

            <p className='mt-4 max-w-2xl text-lg opacity-90 sm:text-xl'>
                {siteConfig.description}
            </p>

            <SearchProduct />
        </Mdiv>
    )
}
