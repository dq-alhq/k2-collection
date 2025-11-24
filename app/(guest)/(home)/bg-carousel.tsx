'use client'
import Autoplay from 'embla-carousel-autoplay'
import Fade from 'embla-carousel-fade'
import Image from 'next/image'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from '@/components/ui/carousel'

export default function BgCarousel() {
    return (
        <>
            <Carousel
                className='absolute inset-0 size-full overflow-hidden'
                plugins={[
                    Fade(),
                    Autoplay({
                        delay: 2000,
                    }),
                ]}
            >
                <CarouselContent className='h-[85vh]'>
                    <CarouselItem>
                        <Image
                            src='/images/banner1.jpg'
                            alt='Banner 1'
                            className='size-full object-cover'
                            width={1036}
                            height={643}
                            priority
                        />
                    </CarouselItem>
                    <CarouselItem>
                        <Image
                            src='/images/banner2.jpg'
                            className='size-full object-cover'
                            alt='Banner 2'
                            width={1036}
                            height={643}
                        />
                    </CarouselItem>
                    <CarouselItem>
                        <Image
                            src='/images/banner3.jpg'
                            alt='Banner 3'
                            className='size-full object-cover'
                            width={1036}
                            height={643}
                        />
                    </CarouselItem>
                </CarouselContent>
            </Carousel>
            <div className='absolute inset-0 bg-black/65' />
        </>
    )
}
