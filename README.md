# Inception Chat — prompts and design extraction

Extracted from [chat.inceptionlabs.ai](https://chat.inceptionlabs.ai/) on 19 October 2026.

## Result

The five fresh collection captures contain the same **11 suggested prompts**, in **five different orders**: **55 observations**, with no additions, removals, or wording changes. Three additional loads after the initial desktop/mobile captures revealed no additional prompts.

The design inspection covers the public landing page in **1440 × 1000** desktop and **390 × 844** mobile viewports, with the suggestion accordion closed and open. Core findings: Mona Sans; a 680 px content column; 12 px mobile gutters; 16 px composer corners; 12 px suggestion corners; a 256 px suggestion scroll area; and responsive changes at 475, 640, and 768 px. The stylesheet supplies 44 semantic color tokens per theme.

## Files

| File | Use |
| --- | --- |
| [DESIGN.md](DESIGN.md) | Full desktop/mobile specification, components, interactions, assets, and implementation guidance |
| [PROMPTS.md](PROMPTS.md) | Human-readable exact prompt collection |
| [PROMPTS.json](PROMPTS.json) | Exact title and description fields, combined text, stable IDs, and observed positions |
| [design-tokens.css](design-tokens.css) | Original semantic colors and foundation tokens, plus explicitly marked convenient aliases |
| [design-tokens.json](design-tokens.json) | Machine-readable token values, provenance, source declarations, and measured observations |
| [refresh-log.json](refresh-log.json) | Five capture orders, membership comparisons, source metadata, and hashes |
| [responsive-measurements.json](responsive-measurements.json) | Desktop/mobile component geometry and styles in all four measured states |

## Reuse

Read `DESIGN.md` for the layout and component specification. Import `design-tokens.css` and use `.dark` on the theme root for the observed dark palette. Apply `--surface` to the application shell: its dark value is `#111`, while the underlying body background is `#0a0a0a`. Font and logo assets are referenced in the specification; their binaries are not bundled.

Use `PROMPTS.json` when populating suggestion cards. Its titles and descriptions preserve the displayed source text. For the three entries with descriptions, `full_prompt` is explicitly identified as a reconstruction from the two display fields; no prompt was selected or submitted to verify an insertion payload. Check the record's field names and provenance before mapping it into your application.

Source color values and responsive declarations are exact. Numeric component heights and positions are observations of the stated viewport and empty-composer state. Light colors are source-declared; detailed visual/geometry inspection was in dark mode. The package distinguishes source values, observations, and suggested implementation aliases.

Primary sources: [page](https://chat.inceptionlabs.ai/) and [deployed stylesheet](https://chat.inceptionlabs.ai/_next/static/immutable/chunks/0cgm-x4dz_snt.css).

## App

A working Vite + React 19 + TypeScript + Tailwind v4 chat UI rebuilt from the captured tokens lives in [`app/`](app/). A small Bun server keeps provider keys out of the browser; on Vercel the same handlers run as functions from `app/api/`.

```sh
cd app
bun install
cp .env.example .env.local   # add an OpenRouter key (free models need no credits)
bun run dev     # API on :3003 + Vite on http://localhost:3002
bun run build   # tsc + vite build -> dist/
bun run start   # production: API + built app on :3003
bun run lint    # oxlint
```

See [`app/README.md`](app/README.md) for the provider setup (local Ollama + OpenRouter free models), the Thinking menu, and where each piece lives. The app vendors `PROMPTS.json` and `design-tokens.css` into `app/src/data/` so it builds standalone on Vercel; run `bun run sync-assets` from `app/` to refresh them from the canonical root copies. Product analytics run through `@vercel/analytics` (`chat_sent`, `prompt_picked`, `diffusion_toggled`, `chat_stopped`).

## Deploy

Set the project root to `app/` on Vercel. The build emits `dist/` and `api/*.ts` become serverless functions. Add `OPENROUTER_API_KEY` as an environment variable in the Vercel dashboard.

## License

[MIT](LICENSE). The design and prompt data are observational captures of a third-party site, recorded for study and reuse; verify provenance fields before depending on any value. Trademarks, logos, and font binaries belong to their respective owners and are not bundled.
