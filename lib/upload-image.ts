import {
    ImageKitAbortError,
    ImageKitInvalidRequestError,
    ImageKitServerError,
    ImageKitUploadNetworkError,
    upload,
} from '@imagekit/next'
import { toast } from 'sonner'

const authenticator = async () => {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/upload-auth`,
        )
        if (!response.ok) {
            const errorText = await response.text()
            console.error(
                `Request failed with status ${response.status}: ${errorText}`,
            )
        }

        const data = await response.json()
        const { signature, expire, token, publicKey } = data
        return { signature, expire, token, publicKey }
    } catch (error) {
        console.error('Authentication error:', error)
        throw new Error('Authentication request failed')
    }
}

export const uploadImage = async (file: string) => {
    let authParams: {
        signature: string
        expire: number
        token: string
        publicKey: string
    }
    try {
        authParams = await authenticator()
    } catch (authError) {
        console.error('Failed to authenticate for upload:', authError)
        return null
    }

    const { signature, expire, token, publicKey } = authParams
    const abortController = new AbortController()

    try {
        const uploadResponse = await upload({
            expire,
            token,
            signature,
            publicKey,
            file,
            fileName: Date.now().toString(),
            onProgress: (event) => {
                toast.promise(
                    Promise.resolve({
                        loaded: event.loaded,
                        total: event.total,
                    }),
                    {
                        loading: `Mengunggah ${event.loaded} / ${event.total}`,
                    },
                )
            },
            abortSignal: abortController.signal,
        })
        return uploadResponse.url!
    } catch (error) {
        if (error instanceof ImageKitAbortError) {
            console.error('Upload aborted:', error.reason)
        } else if (error instanceof ImageKitInvalidRequestError) {
            console.error('Invalid request:', error.message)
        } else if (error instanceof ImageKitUploadNetworkError) {
            console.error('Network error:', error.message)
        } else if (error instanceof ImageKitServerError) {
            console.error('Server error:', error.message)
        } else {
            console.error('Upload error:', error)
        }
        return null
    }
}
