export type Role = 'user' | 'assistant'
export type Message = {
  id: string
  role: Role
  content: string
  reasoning?: string
  model?: string
  error?: string
}
export type Thinking = 'low' | 'medium' | 'high'
export type Provider = 'openrouter' | 'ollama'
export type ModelInfo = { id: string; name: string; provider: Provider; reasoning: boolean }
export type ChatOptions = { model: ModelInfo; thinking: Thinking; diffusion: boolean; signal?: AbortSignal }
export type Snapshot = { content: string; reasoning: string }

export async function fetchModels(): Promise<ModelInfo[]> {
  const res = await fetch('/api/models')
  if (!res.ok) throw new Error(`Could not load models (${res.status})`)
  return ((await res.json()) as { models: ModelInfo[] }).models
}

/**
 * Streams the assistant reply from the API server as full-text snapshots.
 * With the diffusion effect on, the not-yet-settled tail is shown as noise
 * that resolves as more text arrives.
 */
export async function* streamReply(history: Message[], opts: ChatOptions): AsyncGenerator<Snapshot> {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      provider: opts.model.provider,
      model: opts.model.id,
      thinking: opts.model.reasoning ? opts.thinking : undefined,
      messages: history.map(({ role, content }) => ({ role, content })),
    }),
    signal: opts.signal,
  })
  if (!res.ok || !res.body) {
    const err = await res.json().catch(() => null)
    throw new Error(err?.error ?? `Request failed (${res.status})`)
  }

  let content = ''
  let reasoning = ''
  let buffer = ''
  const reader = res.body.pipeThrough(new TextDecoderStream()).getReader()
  for (;;) {
    const { value, done } = await reader.read()
    if (done) break
    buffer += value
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''
    for (const line of lines) {
      if (!line.startsWith('data:')) continue
      const data = line.slice(5).trim()
      if (data === '[DONE]') continue
      const chunk = JSON.parse(data)
      if (chunk.error) throw new Error(chunk.error.message ?? 'Stream error')
      const delta = chunk.choices?.[0]?.delta ?? {}
      content += delta.content ?? ''
      reasoning += delta.reasoning ?? delta.reasoning_content ?? ''
    }
    yield { content: opts.diffusion ? scrambleTail(content) : content, reasoning }
  }
  yield { content, reasoning }
}

const NOISE = 'abcdefghijklmnopqrstuvwxyz0123456789#%&*+=?'
const noiseChar = () => NOISE[Math.floor(Math.random() * NOISE.length)]

/** Replace an unresolved fraction of characters with noise, keeping whitespace. */
export function denoise(text: string, progress: number): string {
  if (progress >= 1) return text
  let out = ''
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    // Deterministic per-position threshold so characters lock in and stay.
    const t = ((i * 2654435761) % 1000) / 1000
    out += /\s/.test(c) || t < progress ? c : noiseChar()
  }
  return out
}

/** Settled text plus a scrambled, partly resolved tail. */
function scrambleTail(text: string, tail = 28): string {
  const cut = Math.max(0, text.length - tail)
  let out = text.slice(0, cut)
  for (let i = cut; i < text.length; i++) {
    const c = text[i]
    const resolved = (i - cut) / tail < 0.35 // the oldest part of the tail settles first
    out += /\s/.test(c) || resolved ? c : noiseChar()
  }
  return out
}
