'use client'

import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { Header } from '@/components/header'
import { ChatInput } from '@/components/chat-input'
import { models, type Model } from '@/components/model-selector'
import { ChatMessage } from '@/components/chat-message'

export default function Home() {
  const [selectedModel, setSelectedModel] = useState<Model>(models[0])
  const [inputValue, setInputValue] = useState('')
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: '/api/chat',
        body: { model: selectedModel.id },
      }),
    [selectedModel.id]
  )

  const { messages, sendMessage, status, setMessages } = useChat({
    transport,
  })

  const isLoading = status === 'streaming' || status === 'submitted'

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleImageSelect = useCallback((imageUrl: string | null, file?: File | null) => {
    setSelectedImage(imageUrl)
    setSelectedImageFile(file || null)
  }, [])

  const handleSend = useCallback(async () => {
    if (!inputValue.trim() && !selectedImage) return

    const textContent = inputValue.trim()
    setInputValue('')
    
    // Handle image attachment
    if (selectedImage && selectedImageFile) {
      // Convert file to base64 for the AI
      const reader = new FileReader()
      reader.onload = async () => {
        const base64 = reader.result as string
        
        sendMessage({
          text: textContent || 'What do you see in this image?',
          files: [{
            mediaType: selectedImageFile.type as `image/${string}`,
            base64: base64.split(',')[1], // Remove data URL prefix
          }],
        })
        
        setSelectedImage(null)
        setSelectedImageFile(null)
      }
      reader.readAsDataURL(selectedImageFile)
    } else {
      sendMessage({ text: textContent })
    }
  }, [inputValue, selectedImage, selectedImageFile, sendMessage])

  // Clear chat when model changes
  const handleModelChange = useCallback((model: Model) => {
    setSelectedModel(model)
    setMessages([])
  }, [setMessages])

  return (
    <div className="flex flex-col h-screen bg-background">
      <Header 
        selectedModel={selectedModel} 
        onSelectModel={handleModelChange} 
      />
      
      {/* Chat Container */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[800px] mx-auto px-4 md:px-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-primary">K</span>
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                How can I help you today?
              </h2>
              <p className="text-muted-foreground text-sm max-w-md">
                Ask me anything, share an image for analysis, or let me help you with code.
              </p>
            </div>
          ) : (
            <div className="py-4">
              {messages.map((message) => (
                <ChatMessageItem key={message.id} message={message} />
              ))}
              {isLoading && messages[messages.length - 1]?.role === 'user' && (
                <div className="flex gap-3 py-6">
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-xs font-bold text-primary-foreground">K</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>
      
      <div className="sticky bottom-0 w-full bg-gradient-to-t from-background via-background to-transparent pt-4 pb-6">
        <div className="max-w-[800px] mx-auto px-4 md:px-6">
          <ChatInput
            value={inputValue}
            onChange={setInputValue}
            onSend={handleSend}
            onImageSelect={handleImageSelect}
            selectedImage={selectedImage}
            disabled={isLoading}
          />
        </div>
      </div>
    </div>
  )
}
