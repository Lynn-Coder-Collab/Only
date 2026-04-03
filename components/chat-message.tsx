'use client'

import { User } from 'lucide-react'
import { CodeBlock } from './code-block'
import { cn } from '@/lib/utils'
import Image from 'next/image'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  image?: string
}

interface ChatMessageProps {
  message: Message
}

function parseContent(content: string) {
  const parts: { type: 'text' | 'code'; content: string; language?: string }[] = []
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g
  let lastIndex = 0
  let match

  while ((match = codeBlockRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', content: content.slice(lastIndex, match.index) })
    }
    parts.push({ type: 'code', content: match[2].trim(), language: match[1] || 'plaintext' })
    lastIndex = match.index + match[0].length
  }

  if (lastIndex < content.length) {
    parts.push({ type: 'text', content: content.slice(lastIndex) })
  }

  return parts
}

function renderTextWithFormatting(text: string) {
  const lines = text.split('\n')
  return lines.map((line, i) => {
    let formattedLine: React.ReactNode = line

    // Bold
    if (line.includes('**')) {
      const parts = line.split(/\*\*(.*?)\*\*/g)
      formattedLine = parts.map((part, j) => 
        j % 2 === 1 ? <strong key={j} className="font-semibold">{part}</strong> : part
      )
    }

    // Inline code
    if (typeof formattedLine === 'string' && formattedLine.includes('`')) {
      const parts = formattedLine.split(/`([^`]+)`/g)
      formattedLine = parts.map((part, j) =>
        j % 2 === 1 ? (
          <code key={j} className="px-1.5 py-0.5 rounded bg-muted text-sm font-mono text-slate-700">
            {part}
          </code>
        ) : part
      )
    }

    return (
      <span key={i}>
        {formattedLine}
        {i < lines.length - 1 && <br />}
      </span>
    )
  })
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user'
  const parts = parseContent(message.content)

  return (
    <div className={cn("flex gap-3 py-6", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary flex items-center justify-center mt-0.5">
          <span className="text-xs font-bold text-primary-foreground">K</span>
        </div>
      )}
      
      <div className={cn("max-w-[85%] md:max-w-[75%]", isUser && "text-right")}>
        {message.image && (
          <div className={cn("mb-3", isUser && "flex justify-end")}>
            <div className="relative inline-block rounded-lg overflow-hidden border border-border shadow-sm">
              <Image
                src={message.image}
                alt="Attached image"
                width={280}
                height={200}
                className="object-cover max-h-[200px] w-auto"
              />
            </div>
          </div>
        )}
        
        <div className={cn(
          "text-[15px] leading-relaxed",
          isUser ? "text-slate-900" : "text-slate-800"
        )}>
          {parts.map((part, index) => (
            part.type === 'code' ? (
              <CodeBlock key={index} code={part.content} language={part.language} />
            ) : (
              <p key={index} className={cn("whitespace-pre-wrap", index > 0 && "mt-3")}>
                {renderTextWithFormatting(part.content)}
              </p>
            )
          ))}
        </div>
      </div>
      
      {isUser && (
        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center mt-0.5">
          <User className="size-4 text-slate-600" />
        </div>
      )}
    </div>
  )
}
