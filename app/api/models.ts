// Vercel function for GET /api/models (locally, server/index.ts serves it).
import { models } from '../server/providers.js'

export function GET() {
  return models()
}
