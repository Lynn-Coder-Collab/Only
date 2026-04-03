'use client'

import { useRef, useState, useEffect, type KeyboardEvent, type ChangeEvent } from 'react'
import { Paperclip, Settings, Send, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import Image from 'next/image'

interface ChatInputProps {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  onImageSelect: (imageUrl: string | null, file?: File | null) => void
  selectedImage: string | null
  disabled?: boolean
}

export function ChatInput({ 
  value, 
  onChange, 
  onSend, 
  onImageSelect,
  selectedImage,
  disabled 
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`
    }
  }, [value])

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (value.trim() || selectedImage) {
        onSend()
      }
    }
  }

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      onImageSelect(url, file)
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleRemoveImage = () => {
    onImageSelect(null, null)
  }

  return (
    <div className="w-full">
      {selectedImage && (
        <div className="mb-3 flex justify-start">
          <div className="relative inline-block group">
            <div className="w-20 h-20 rounded-lg overflow-hidden border border-border shadow-sm bg-muted">
              <Image
                src={selectedImage}
                alt="Selected image"
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </div>
            <button
              onClick={handleRemoveImage}
              className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-slate-700 transition-colors shadow-md"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}
      
      <div className={cn(
        "relative flex items-end rounded-2xl border bg-background shadow-lg transition-all duration-200",
        isFocused ? "border-primary/50 ring-4 ring-primary/10" : "border-border"
      )}>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex-shrink-0 p-3 text-muted-foreground hover:text-foreground transition-colors"
          title="Attach image"
        >
          <Paperclip className="size-5" />
        </button>

        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Ask Kii-v0 or add a photo..."
          disabled={disabled}
          rows={1}
          className="flex-1 py-3.5 px-1 bg-transparent text-[15px] text-foreground placeholder:text-muted-foreground resize-none outline-none max-h-[200px] leading-relaxed"
        />

        <div className="flex items-center gap-1 pr-2 pb-2">
          <button
            className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted"
            title="Settings"
          >
            <Settings className="size-5" />
          </button>
          
          <button
            onClick={onSend}
            disabled={disabled || (!value.trim() && !selectedImage)}
            className={cn(
              "p-2 rounded-lg transition-all duration-200",
              (value.trim() || selectedImage) && !disabled
                ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                : "text-muted-foreground/50 cursor-not-allowed"
            )}
            title="Send message"
          >
            <Send className="size-5" />
          </button>
        </div>
      </div>
      
      <p className="text-[11px] text-muted-foreground text-center mt-3">
        Kii-v0 can make mistakes. Consider checking important information.
      </p>
    </div>
  )
}
