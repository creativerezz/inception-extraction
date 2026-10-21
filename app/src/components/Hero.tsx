import { useEffect, useState } from 'react'
import { brand, playgrounds } from '../lib/brand'
import { denoise } from '../lib/chat'
import { playgroundIcons } from './playgroundIcons'
import { BrandMark } from './icons'

/** Scrambled characters resolve into the tagline, as on the source page. */
function useScramble(text: string, durationMs = 700) {
  const [reduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [out, setOut] = useState(() => (reduced ? text : denoise(text, 0)))
  useEffect(() => {
    if (reduced) return
    const start = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / durationMs)
      setOut(denoise(text, p))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [text, durationMs, reduced])
  return out
}

export function Hero() {
  const tagline = useScramble(brand.tagline)
  return (
    <>
      <div className="mb-6 sm:mb-10">
        <div className="mb-3 flex items-center justify-center gap-2.5 sm:mb-4 sm:gap-4">
          <BrandMark className="h-8 w-8 sm:h-11 sm:w-11" />
          <span className="text-4xl font-semibold tracking-tight text-fg sm:text-6xl">{brand.name}</span>
        </div>
        <p className="text-center text-sm tracking-wide text-fg-muted sm:text-lg" aria-label={brand.tagline}>
          <span aria-hidden="true">{tagline}</span>
        </p>
      </div>

      <div className="mb-3 flex flex-wrap justify-center gap-2">
        {playgrounds.map(({ key, title, description, href }) => {
          const PIcon = playgroundIcons[key]
          return (
            <a
              key={key}
              href={href}
              className="group flex items-center gap-2 rounded-xl border border-edge-dim px-3 py-2 transition-colors hover:border-edge-hover hover:bg-surface-hover"
            >
              <PIcon className="shrink-0 text-accent" />
              <span className="text-xs font-medium text-fg">{title}</span>
              <span className="hidden text-xs text-fg-muted sm:inline">{description}</span>
            </a>
          )
        })}
      </div>
    </>
  )
}
