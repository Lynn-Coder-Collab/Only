'use client'

import { Terminal, Zap } from 'lucide-react'
import { ModelSelector, type Model } from './model-selector'

interface HeaderProps {
  selectedModel: Model
  onSelectModel: (model: Model) => void
}

export function Header({ selectedModel, onSelectModel }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-[800px] mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-sm">
            <Zap className="size-4 text-primary-foreground" fill="currentColor" />
          </div>
          <span className="text-lg font-semibold text-slate-900 tracking-tight">
            Kii-v0
          </span>
        </div>
        
        <ModelSelector 
          selectedModel={selectedModel} 
          onSelectModel={onSelectModel} 
        />
      </div>
    </header>
  )
}
