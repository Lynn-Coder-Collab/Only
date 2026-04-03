'use client'

import { ChevronDown, Brain, Code, Lightbulb, Zap, Sparkles, Rocket } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

export interface Model {
  id: string
  name: string
  label: string
  icon: React.ReactNode
}

export const models: Model[] = [
  { id: 'kimi-k2.5', name: 'Kimi-K2.5', label: 'The 1T Brain', icon: <Brain className="size-4" /> },
  { id: 'qwen-2.5-coder', name: 'Qwen-2.5-Coder', label: 'UI Specialist', icon: <Code className="size-4" /> },
  { id: 'deepseek-v3', name: 'DeepSeek-V3', label: 'Logic Master', icon: <Lightbulb className="size-4" /> },
  { id: 'llama-3.1-405b', name: 'Llama-3.1-405B', label: 'The Titan', icon: <Rocket className="size-4" /> },
  { id: 'mistral-large-2', name: 'Mistral-Large-2', label: 'Creative', icon: <Sparkles className="size-4" /> },
  { id: 'phi-3.5-moe', name: 'Phi-3.5-MoE', label: 'Fast', icon: <Zap className="size-4" /> },
]

interface ModelSelectorProps {
  selectedModel: Model
  onSelectModel: (model: Model) => void
}

export function ModelSelector({ selectedModel, onSelectModel }: ModelSelectorProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-background hover:bg-muted/50 transition-colors shadow-sm">
          <span className="text-primary">{selectedModel.icon}</span>
          <div className="flex flex-col items-start">
            <span className="text-sm font-medium text-foreground leading-none">
              {selectedModel.name}
            </span>
            <span className="text-[10px] text-muted-foreground mt-0.5">
              {selectedModel.label}
            </span>
          </div>
          <ChevronDown className="size-4 text-muted-foreground ml-1" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {models.map((model) => (
          <DropdownMenuItem
            key={model.id}
            onClick={() => onSelectModel(model)}
            className={cn(
              "flex items-center gap-3 py-2.5 cursor-pointer",
              selectedModel.id === model.id && "bg-muted"
            )}
          >
            <span className={cn(
              "text-muted-foreground",
              selectedModel.id === model.id && "text-primary"
            )}>
              {model.icon}
            </span>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{model.name}</span>
              <span className="text-xs text-muted-foreground">{model.label}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
