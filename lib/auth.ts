import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { APIError, createAuthMiddleware } from 'better-auth/api'
import prisma from '@/lib/prisma'
import { passwordSchema } from '@/lib/zod'

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: 'postgresql',
    }),
    emailAndPassword: {
        enabled: true,
        disableSignUp: false,
        requireEmailVerification: false,
    },
    user: {
        changeEmail: {
            enabled: true,
        },
    },
    secret: process.env.NEXT_PUBLIC_BETTER_AUTH_SECRET,
    hooks: {
        before: createAuthMiddleware(async (context) => {
            if (
                context.path === '/reset-password' ||
                context.path === '/change-password'
            ) {
                const password =
                    context.body.password || context.body.newPassword
                const { error } = passwordSchema.safeParse(password)
                if (error) {
                    throw new APIError('BAD_REQUEST', {
                        message: 'Password kurang kuat',
                    })
                }
            }
        }),
    },
})
