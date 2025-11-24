'use client'

import { X } from 'lucide-react'
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

        const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userText }),
        })

        const data = await res.json()
        setMessages((prev) => [...prev, { sender: 'bot', text: data.reply }])
    }

    return (
        <div className='fixed right-4 bottom-4 z-50'>
            {open ? (
                <Card className='flex h-96 w-xl flex-col rounded-2xl py-0 shadow-xl'>
                    <CardContent className='flex h-full flex-col p-0'>
                        <div className='flex items-center justify-between rounded-t-2xl bg-primary p-3 text-primary-foreground'>
                            <h2 className='font-semibold text-lg'>
                                Chatbot Konveksi
                            </h2>
                            <Button
                                size='icon'
                                variant='ghost'
                                className='text-white'
                                onClick={() => setOpen(false)}
                            >
                                <X className='h-5 w-5' />
                            </Button>
                        </div>

                        <ScrollArea className='flex-1 space-y-3 bg-background p-3'>
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
                                                : 'rounded-bl-none border bg-white text-primary'
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
                    className='rounded-full px-5 py-3 text-base shadow-xl'
                >
                    Chat
                </Button>
            )}
        </div>
    )
}
