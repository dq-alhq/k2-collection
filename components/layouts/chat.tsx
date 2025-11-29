'use client'

import { IconX } from '@tabler/icons-react'
import { motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'

export default function Chatbot() {
    const [open, setOpen] = useState(false)
    const [messages, setMessages] = useState([
        {
            sender: 'bot',
            text: 'Halo! Ada yang bisa saya bantu mengenai layanan konveksi kami?',
        },
    ])
    const [input, setInput] = useState('')
    const bottomRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const sendMessage = async () => {
        if (!input.trim()) return

        const userText = input
        setMessages((prev) => [...prev, { sender: 'user', text: userText }])
        setInput('')

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/chat`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userText }),
            },
        )

        const data = await res.json()
        setMessages((prev) => [...prev, { sender: 'bot', text: data.reply }])
    }

    return (
        <div className='fixed bottom-0 z-50 flex w-full justify-center md:right-4 md:w-fit'>
            {open ? (
                <Card className='flex max-h-[70vh] w-screen flex-col rounded-2xl rounded-b-none py-0 shadow-xl md:w-xl'>
                    <CardContent className='p-0'>
                        <div className='flex items-center justify-between rounded-t-2xl bg-primary p-3 text-primary-foreground'>
                            <h2 className='font-semibold text-lg'>
                                Chatbot Konveksi
                            </h2>
                            <Button
                                size='icon'
                                variant='ghost'
                                onClick={() => setOpen(false)}
                            >
                                <IconX />
                            </Button>
                        </div>

                        <ScrollArea className='h-[50vh] flex-1 space-y-3 bg-background px-3 py-2'>
                            {messages.map((msg, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`my-1 max-w-[80%] whitespace-pre-line rounded-xl px-3 py-2 text-sm shadow-sm ${
                                            msg.sender === 'user'
                                                ? 'rounded-br-none bg-primary text-primary-foreground'
                                                : 'rounded-bl-none border bg-card text-card-foreground'
                                        }`}
                                    >
                                        {msg.text}
                                    </div>
                                </motion.div>
                            ))}
                            <div ref={bottomRef} />
                        </ScrollArea>

                        <div className='flex gap-2 border-t bg-background p-3'>
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) =>
                                    e.key === 'Enter' && sendMessage()
                                }
                                placeholder='Tulis pesan...'
                            />
                            <Button onClick={sendMessage}>Kirim</Button>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Button
                    onClick={() => setOpen(true)}
                    className='rounded-xl rounded-b-none px-5 py-3 text-base shadow-xl'
                >
                    Chat
                </Button>
            )}
        </div>
    )
}
