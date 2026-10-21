import { brand, playgrounds } from '../lib/brand'
import type { Theme } from '../lib/useTheme'
import { BrandMark, MenuIcon, MoonIcon, SunIcon } from './icons'
import { playgroundIcons } from './playgroundIcons'

const iconButton =
  'grid h-8 w-8 place-items-center rounded-lg text-fg-muted transition-colors hover:bg-surface-hover hover:text-fg'

type Props = { theme: Theme; onToggleTheme: () => void; onOpenHistory: () => void; onHome: () => void }

export function Header({ theme, onToggleTheme, onOpenHistory, onHome }: Props) {
  return (
    <header className="border-b border-edge-dim bg-surface">
      <div className="mx-auto flex h-12 items-center justify-between px-3 sm:h-14 sm:px-5">
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          <button type="button" className={iconButton} onClick={onOpenHistory} aria-label="Open chat history">
            <MenuIcon size={18} />
          </button>
          <a
            href="/"
            onClick={(e) => (e.preventDefault(), onHome())}
            className="flex items-center gap-2"
            aria-label={`${brand.name} home`}
          >
            <BrandMark className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="hidden w-[70px] truncate text-base font-semibold tracking-tight text-fg xs:block sm:w-[90px] sm:text-lg">
              {brand.name}
            </span>
          </a>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <nav className="flex items-center gap-0.5 sm:gap-1" aria-label="Playgrounds">
            {playgrounds.filter((p) => p.key !== 'search').map(({ key, title, href }) => {
              const PIcon = playgroundIcons[key]
              return (
                <a
                  key={key}
                  href={href}
                  aria-label={title}
                  className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm text-fg-secondary transition-colors hover:bg-surface-hover hover:text-fg"
                >
                  <PIcon className="text-accent" />
                  <span className="hidden sm:inline">{title}</span>
                </a>
              )
            })}
          </nav>
          <button
            type="button"
            className={iconButton}
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            {theme === 'dark' ? <SunIcon size={18} /> : <MoonIcon size={18} />}
          </button>
          <a
            href={brand.ctaHref}
            className="rounded-lg bg-cta px-3 py-1 text-xs font-medium text-cta-fg transition-opacity hover:opacity-80 sm:px-4 sm:py-1.5 sm:text-sm"
          >
            {brand.ctaLabel}
          </a>
        </div>
      </div>
    </header>
  )
}
