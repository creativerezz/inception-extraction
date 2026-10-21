// Vercel function for POST /api/chat (locally, server/index.ts serves it).
import { chat } from '../server/providers.js'

export function POST(request: Request) {
  return chat(request)
}
