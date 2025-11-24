'use client'

import { XIcon } from 'lucide-react'
import Image from 'next/image'
import { type ChangeEvent, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
    ImageCrop,
    ImageCropApply,
    ImageCropContent,
    ImageCropReset,
} from '@/components/ui/image-crop'
import { Input } from '@/components/ui/input'

export const InputImage = ({
    value,
    action,
}: {
    value: string | null
    action: (value: string | null) => void
}) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [croppedImage, setCroppedImage] = useState<string | null>(value)
    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            setSelectedFile(file)
            setCroppedImage(null)
        }
    }

    const handleReset = () => {
        setSelectedFile(null)
        action(null)
        setCroppedImage(null)
    }

    const onCrop = (image: string) => {
        action(image)
        setCroppedImage(image)
    }

    if (!selectedFile && !croppedImage) {
        return (
            <Input
                id='image'
                accept='image/*'
                className='w-fit'
                onChange={handleFileChange}
                placeholder='Upload gambar'
                type='file'
            />
        )
    }

    if (croppedImage) {
        return (
            <div className='relative overflow-hidden'>
                <Image
                    alt='Cropped'
                    height={200}
                    src={croppedImage}
                    unoptimized
                    width={200}
                />
                <Button
                    className='absolute top-2 left-2'
                    onClick={handleReset}
                    size='icon'
                    type='button'
                    variant='outline'
                >
                    <XIcon className='size-4' />
                </Button>
            </div>
        )
    }
    return (
        <div className='space-y-4'>
            <ImageCrop
                aspect={1}
                file={selectedFile as File}
                maxImageSize={1024 * 1024}
                onCrop={onCrop}
            >
                <ImageCropContent className='max-w-md' />
                <div className='flex items-center gap-2'>
                    <ImageCropApply />
                    <ImageCropReset />
                    <Button
                        onClick={handleReset}
                        size='icon'
                        type='button'
                        variant='ghost'
                    >
                        <XIcon className='size-4' />
                    </Button>
                </div>
            </ImageCrop>
        </div>
    )
}
