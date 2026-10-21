# Chat app

A Vite + React 19 + TypeScript + Tailwind v4 build of the landing page described in `../DESIGN.md`.

```sh
bun install
bun run dev     # API server on :3003 + Vite on http://localhost:3002 (proxies /api)
bun run build   # tsc + vite build
bun run start   # production: API + built app from dist/ on :3003
bun run lint    # oxlint
```

## Free models

`server/index.ts` is a small Bun server that keeps keys out of the browser. `/api/models` lists:

- **Local Ollama models** (no key) from `OLLAMA_URL`, default `http://localhost:11434`. Embedding
  models are skipped. Ollama `:cloud` models may need a paid plan; their error is shown in the chat.
- **OpenRouter free models** (`:free`, plus the `openrouter/free` router) once you put a key from
  https://openrouter.ai/keys in `app/.env.local` (see `.env.example`). Free models need no credits
  but are rate-limited.

The Thinking menu sends `reasoning.effort` (OpenRouter) or `reasoning_effort` (Ollama); reasoning
tokens show in a collapsible "Thought process" block.

## Where things are

- `src/index.css` imports `../design-tokens.css` (the only copy of the tokens) and maps them to Tailwind
  utilities: `bg-surface`, `bg-surface-alt`, `border-edge`, `text-fg-muted` and so on. `xs` = 475px.
- `src/lib/prompts.ts` reads `../PROMPTS.json` and shuffles it on each load.
- `src/lib/brand.ts` holds the placeholder name, tagline, model label and links. The source logo
  artwork is not bundled; `BrandMark` in `components/icons.tsx` is a stand-in.
- `src/lib/chat.ts` calls `/api/chat` and parses the OpenAI-style stream into full-text snapshots.
  With the Diffusion Effect on, the newest few characters show as noise until they settle.

Theme (dark by default), chat history and cookie dismissal are kept in `localStorage`.
Voice and dictation buttons are placeholders and do nothing yet.
