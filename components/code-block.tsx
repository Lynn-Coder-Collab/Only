'use client'

import { useState } from 'react'
import { Check, Copy, Play } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CodeBlockProps {
  code: string
  language?: string
}

export function CodeBlock({ code, language = 'typescript' }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const isPreviewable = language === 'html' || code.includes('<') && code.includes('>')

  return (
    <div className="my-3 rounded-lg border border-border bg-muted/30 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/50">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {language}
        </span>
        <div className="flex items-center gap-1">
          {isPreviewable && (
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-colors",
                showPreview 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <Play className="size-3" />
              Preview
            </button>
          )}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
          >
            {copied ? (
              <>
                <Check className="size-3 text-primary" />
                Copied
              </>
            ) : (
              <>
                <Copy className="size-3" />
                Copy
              </>
            )}
          </button>
        </div>
      </div>
      
      {showPreview && isPreviewable ? (
        <div className="p-4 bg-background border-b border-border">
          <div 
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: code }} 
          />
        </div>
      ) : null}
      
      <div className="overflow-x-auto">
        <pre className="p-4 text-sm leading-relaxed">
          <code className="font-mono text-slate-800">{code}</code>
        </pre>
      </div>
    </div>
  )
}
