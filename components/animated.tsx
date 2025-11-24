'use client'
import { motion } from 'framer-motion'
import type { ComponentProps } from 'react'

type MotionDivProps = Omit<
    ComponentProps<typeof motion.div>,
    'onAnimationStart'
> & {
    onAnimationStart?: (definition: string) => void
}

export const Mdiv = (props: MotionDivProps) => {
    const { children, ...rest } = props
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            {...rest}
        >
            {children}
        </motion.div>
    )
}
