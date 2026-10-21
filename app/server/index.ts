/**
 * Local API server (`bun run dev`, `bun run start`). On Vercel the same
 * handlers run as functions from api/ instead.
 *
 *   GET  /api/models
 *   POST /api/chat
 *
 * With `bun run start` it also serves the built app from ../dist.
 * Bun loads app/.env.local automatically.
 */
import { join } from 'node:path'
import { chat, json, models, status } from './providers.ts'

const PORT = Number(process.env.PORT ?? 3003)
const DIST = join(import.meta.dir, '..', 'dist')

async function serveStatic(pathname: string) {
  const file = Bun.file(join(DIST, pathname === '/' ? 'index.html' : pathname))
  if (pathname !== '/' && !pathname.includes('..') && (await file.exists())) return new Response(file)
  const index = Bun.file(join(DIST, 'index.html'))
  return (await index.exists()) ? new Response(index) : new Response('Not found', { status: 404 })
}

Bun.serve({
  port: PORT,
  idleTimeout: 255, // Local models can take a while to load before the first token.
  async fetch(req) {
    const { pathname } = new URL(req.url)
    try {
      if (pathname === '/api/models' && req.method === 'GET') return await models()
      if (pathname === '/api/chat' && req.method === 'POST') return await chat(req)
      if (pathname.startsWith('/api/')) return json({ error: 'Not found' }, 404)
      return await serveStatic(pathname)
    } catch (err) {
      if (req.signal.aborted) return new Response(null, { status: 499 })
      return json({ error: String(err) }, 500)
    }
  },
})

console.log(`api on http://localhost:${PORT} — ${status}`)
