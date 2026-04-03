'use client'

import { useRef, useEffect } from 'react'
import { ChatMessage, type Message } from './chat-message'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sparkles } from 'lucide-react'

interface ChatContainerProps {
  messages: Message[]
}

export function ChatContainer({ messages }: ChatContainerProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Sparkles className="size-8 text-primary" />
          </div>
          <h2 className="text-2xl font-semibold text-slate-900 mb-2 text-balance">
            How can I help you today?
          </h2>
          <p className="text-muted-foreground text-[15px] leading-relaxed">
            Ask me anything or share an image to get started. I can help with coding, analysis, creative writing, and more.
          </p>
        </div>
      </div>
    )
  }

  return (
    <ScrollArea className="flex-1">
      <div className="max-w-[800px] mx-auto px-4 md:px-6">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        <div ref={bottomRef} className="h-4" />
      </div>
    </ScrollArea>
  )
}
