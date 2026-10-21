import data from '../data/prompts.json'

export type Prompt = { id: string; title: string; description: string; text: string }

type RawPrompt = { id: string; title: string; description: string }

export const prompts: Prompt[] = data.prompts.map((p: RawPrompt) => ({
  id: p.id,
  title: p.title,
  description: p.description,
  text: p.description ? `${p.title} ${p.description}` : p.title,
}))

// The source shows the same set in a different order on every load.
export function shuffled<T>(items: readonly T[]): T[] {
  const out = [...items]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}
