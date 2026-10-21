/**
 * Provider logic shared by the local Bun server (server/index.ts) and the
 * Vercel functions (api/*.ts). Keys stay server-side.
 *
 *   models()    free OpenRouter models (when OPENROUTER_API_KEY is set) + Ollama models
 *   chat(req)   { provider, model, messages, thinking } -> upstream OpenAI-style SSE, passed through
 */

type Provider = 'openrouter' | 'ollama'
type ModelInfo = { id: string; name: string; provider: Provider; reasoning: boolean }

const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY?.trim()
// On Vercel there is no local Ollama, so only use one that is configured explicitly.
const OLLAMA_URL =
  process.env.OLLAMA_URL?.replace(/\/$/, '') ?? (process.env.VERCEL ? undefined : 'http://localhost:11434')

export const status = `openrouter: ${OPENROUTER_KEY ? 'key set' : 'no key'}, ollama: ${OLLAMA_URL ?? 'off'}`

const upstream: Record<Provider, { url: string; headers: () => Record<string, string> }> = {
  openrouter: {
    url: 'https://openrouter.ai/api/v1',
    headers: () => ({
      Authorization: `Bearer ${OPENROUTER_KEY}`,
      'X-Title': 'Chat',
    }),
  },
  ollama: { url: `${OLLAMA_URL}/v1`, headers: () => ({}) },
}

let modelCache: { at: number; models: ModelInfo[] } | null = null

async function openrouterModels(): Promise<ModelInfo[]> {
  if (!OPENROUTER_KEY) return []
  const res = await fetch(`${upstream.openrouter.url}/models`, { signal: AbortSignal.timeout(8000) })
  if (!res.ok) return []
  const { data } = (await res.json()) as {
    data: {
      id: string
      name: string
      pricing: { prompt: string; completion: string }
      architecture?: { output_modalities?: string[] }
      supported_parameters?: string[]
    }[]
  }
  return data
    .filter(
      (m) =>
        m.pricing.prompt === '0' &&
        m.pricing.completion === '0' &&
        (m.architecture?.output_modalities ?? ['text']).join() === 'text' &&
        !m.id.includes('content-safety'),
    )
    .map((m) => ({
      id: m.id,
      name: m.name.replace(/\s*\(free\)$/i, ''),
      provider: 'openrouter' as const,
      reasoning: m.supported_parameters?.includes('reasoning') ?? false,
    }))
    // The free router first: it picks an available free model per request.
    .sort((a, b) => Number(b.id === 'openrouter/free') - Number(a.id === 'openrouter/free'))
}

async function ollamaModels(): Promise<ModelInfo[]> {
  if (!OLLAMA_URL) return []
  try {
    const res = await fetch(`${upstream.ollama.url}/models`, { signal: AbortSignal.timeout(1500) })
    if (!res.ok) return []
    const { data } = (await res.json()) as { data: { id: string }[] }
    return data
      .filter((m) => !/embed/i.test(m.id))
      .map((m) => ({ id: m.id, name: m.id, provider: 'ollama' as const, reasoning: true }))
  } catch {
    return [] // Ollama not running.
  }
}

async function listModels() {
  if (modelCache && Date.now() - modelCache.at < 60_000) return modelCache.models
  const [ollama, openrouter] = await Promise.all([ollamaModels(), openrouterModels()])
  const models = [...openrouter, ...ollama]
  modelCache = { at: Date.now(), models }
  return models
}

export async function models() {
  return json({ models: await listModels() })
}

type ChatBody = {
  provider: Provider
  model: string
  messages: { role: 'user' | 'assistant' | 'system'; content: string }[]
  thinking?: 'low' | 'medium' | 'high'
}

export async function chat(req: Request) {
  const body = (await req.json()) as ChatBody
  const target = upstream[body.provider]
  if (!target || !body.model || !Array.isArray(body.messages)) return json({ error: 'Bad request' }, 400)
  if (body.provider === 'openrouter' && !OPENROUTER_KEY) {
    return json({ error: 'OPENROUTER_API_KEY is not set' }, 400)
  }
  // Only models from the free list: the endpoint is public once deployed, and
  // passing any model id through would let callers spend the key's credits.
  if (!(await listModels()).some((m) => m.provider === body.provider && m.id === body.model)) {
    return json({ error: 'That model is not available' }, 400)
  }

  const payload: Record<string, unknown> = { model: body.model, messages: body.messages, stream: true }
  if (body.thinking) {
    // Each provider spells the effort knob differently; models without reasoning ignore it.
    if (body.provider === 'openrouter') payload.reasoning = { effort: body.thinking }
    else payload.reasoning_effort = body.thinking
  }

  const res = await fetch(`${target.url}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...target.headers() },
    body: JSON.stringify(payload),
    signal: req.signal,
  })
  if (!res.ok || !res.body) {
    const text = await res.text().catch(() => '')
    let message = text
    try {
      message = JSON.parse(text).error?.message ?? text
    } catch {
      // Not JSON; use the raw text.
    }
    return json({ error: message || `Upstream error ${res.status}` }, res.status === 429 ? 429 : 502)
  }
  return new Response(res.body, {
    headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' },
  })
}

export function json(data: unknown, status = 200) {
  return Response.json(data, { status })
}
