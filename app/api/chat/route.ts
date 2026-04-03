import {
  convertToModelMessages,
  streamText,
} from 'ai'
import { createOpenAI } from '@ai-sdk/openai'

export const maxDuration = 60

// Provider Featherless (Pakai standar OpenAI v3)
const featherless = createOpenAI({
  baseURL: 'https://api.featherless.ai/v1',
  apiKey: process.env.FEATHERLESS_API_KEY,
})

// Map model IDs (Pastiin nama model di kanan sesuai dashboard Featherless)
const MODEL_MAP: Record<string, string> = {
  'kimi-k2.5': 'moonshotai/Kimi-K2-Instruct',
  'qwen-2.5-coder': 'Qwen/Qwen2.5-Coder-32B-Instruct',
  'deepseek-v3': 'deepseek-ai/DeepSeek-V3-0324',
  'llama-3.1-405b': 'meta-llama/Llama-3.3-70B-Instruct',
  'mistral-large-2': 'mistralai/Mistral-Small-24B-Instruct-2501',
  'phi-3.5-moe': 'microsoft/phi-4',
}

export async function POST(req: Request) {
  const { messages, model: modelId } = await req.json()

  // Ambil nama model asli, default ke Kimi kalau kosong
  const modelName = MODEL_MAP[modelId || 'kimi-k2.5'] || MODEL_MAP['kimi-k2.5']

  const result = await streamText({
    model: featherless(modelName),
    system: `You are Kii-v0, a highly capable AI assistant created for professionals. You are:
- Direct and concise in your responses
- Expert at coding, analysis, and creative tasks
- Helpful but never sycophantic - you don't start with phrases like "Great question!" or "I'd be happy to help!"
- You format responses using markdown when appropriate (code blocks, lists, bold, etc.)
- When showing code, always use proper syntax highlighting with the language specified`,
    messages: convertToModelMessages(messages),
  })

  return result.toDataStreamResponse()
  }
