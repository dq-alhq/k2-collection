import { getUploadAuthParams } from '@imagekit/next/server'

export async function GET() {
    const { token, expire, signature } = getUploadAuthParams({
        privateKey: process.env.IK_PRIVATE_KEY as string,
        publicKey: process.env.IK_PUBLIC_KEY as string,
    })

    return Response.json({
        token,
        expire,
        signature,
        publicKey: process.env.IK_PUBLIC_KEY,
    })
}
