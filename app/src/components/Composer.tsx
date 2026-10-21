import { forwardRef, useEffect, useImperativeHandle, useRef, useState, type ReactNode } from 'react'
import type { ModelInfo, Thinking } from '../lib/chat'
import { ArrowUpIcon, BrainIcon, BrandMark, ChevronDownIcon, MicIcon, StopIcon, VoiceIcon } from './icons'

const thinkingLabels: Record<Thinking, string> = { low: 'Low', medium: 'Medium', high: 'High' }

export type ComposerHandle = { setValue: (v: string) => void; focus: () => void }

type Props = {
  busy: boolean
  thinking: Thinking
  onThinking: (t: Thinking) => void
  models: ModelInfo[] | null
  modelError: string | null
  model: ModelInfo | null
  onModel: (m: ModelInfo) => void
  onSubmit: (text: string) => void
  onStop: () => void
}

const roundButton = 'grid h-8 w-8 place-items-center rounded-full transition-colors'

export const Composer = forwardRef<ComposerHandle, Props>(function Composer(
  { busy, thinking, onThinking, models, modelError, model, onModel, onSubmit, onStop },
  ref,
) {
  const [value, setValue] = useState('')
  const textarea = useRef<HTMLTextAreaElement>(null)

  useImperativeHandle(ref, () => ({ setValue, focus: () => textarea.current?.focus() }), [])

  // Auto-grow up to a cap; the empty state is one 22px line plus padding (40px).
  useEffect(() => {
    const el = textarea.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 220)}px`
  }, [value])

  const canSend = value.trim().length > 0 && !busy && model !== null
  const submit = () => {
    if (!canSend) return
    onSubmit(value.trim())
    setValue('')
  }

  return (
    <form
      className="rounded-2xl border border-edge bg-surface-alt"
      onSubmit={(e) => (e.preventDefault(), submit())}
    >
      <label htmlFor="composer" className="sr-only">
        Message
      </label>
      <textarea
        id="composer"
        ref={textarea}
        rows={1}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
            e.preventDefault()
            submit()
          }
        }}
        placeholder="Ask anything…"
        className="block w-full resize-none bg-transparent px-3 pt-3 pb-1.5 text-base leading-snug text-fg placeholder-fg-ghost outline-none sm:px-5"
      />

      <div className="flex items-center justify-between gap-2 px-2 pb-2 sm:px-3 sm:pb-2.5">
        <Menu
          label={`Thinking: ${thinkingLabels[thinking]}`}
          trigger={
            <span className="flex items-center gap-1 rounded-full bg-fg px-2.5 py-1.5 text-sm text-surface transition-opacity hover:opacity-90">
              <BrainIcon />
              <span className="hidden sm:inline">{thinkingLabels[thinking]}</span>
              <ChevronDownIcon size={14} className="hidden sm:block" />
            </span>
          }
          options={(Object.keys(thinkingLabels) as Thinking[]).map((t) => ({ key: t, label: thinkingLabels[t] }))}
          selected={thinking}
          onSelect={(k) => onThinking(k as Thinking)}
          disabled={model?.reasoning === false}
        />

        <div className="flex min-w-0 items-center gap-1 sm:gap-1.5">
          <Menu
            label="Model"
            align="right"
            trigger={
              <span className="flex min-w-0 items-center gap-1.5 rounded-full px-2 py-1.5 text-sm font-medium text-fg-secondary transition-colors hover:bg-surface-hover">
                <BrandMark className="h-4 w-4 shrink-0" />
                <span className="hidden max-w-44 truncate sm:inline">
                  {modelError ? 'No models' : (model?.name ?? 'Loading…')}
                </span>
                <ChevronDownIcon size={14} className="shrink-0" />
              </span>
            }
            header={modelError ?? (models?.length === 0 ? 'No free models found. See README.' : undefined)}
            options={(models ?? []).map((m) => ({
              key: `${m.provider}:${m.id}`,
              label: m.name,
              group: m.provider === 'ollama' ? 'Local (Ollama)' : 'OpenRouter free',
            }))}
            selected={model ? `${model.provider}:${model.id}` : undefined}
            onSelect={(k) => {
              const m = models?.find((x) => `${x.provider}:${x.id}` === k)
              if (m) onModel(m)
            }}
          />
          <button type="button" aria-label="Voice mode" title="Voice mode (not wired)" className={`${roundButton} text-fg-ghost hover:bg-surface-hover hover:text-fg`}>
            <VoiceIcon />
          </button>
          <button type="button" aria-label="Dictate" title="Dictate (not wired)" className={`${roundButton} text-fg-ghost hover:bg-surface-hover hover:text-fg`}>
            <MicIcon />
          </button>
          {busy ? (
            <button type="button" onClick={onStop} aria-label="Stop" className={`${roundButton} bg-btn text-btn-fg hover:bg-btn-hover`}>
              <StopIcon />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!canSend}
              aria-label="Send"
              className={`${roundButton} bg-btn text-btn-fg hover:bg-btn-hover disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-btn`}
            >
              <ArrowUpIcon />
            </button>
          )}
        </div>
      </div>
    </form>
  )
})

type Option = { key: string; label: string; group?: string }

function Menu({
  label,
  trigger,
  options,
  selected,
  onSelect,
  header,
  align = 'left',
  disabled,
}: {
  label: string
  trigger: ReactNode
  options: Option[]
  selected?: string
  onSelect: (key: string) => void
  header?: string
  align?: 'left' | 'right'
  disabled?: boolean
}) {
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => !root.current?.contains(e.target as Node) && setOpen(false)
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={root} className="relative min-w-0">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        title={disabled ? 'This model does not support thinking effort' : undefined}
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className="block min-w-0 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {trigger}
      </button>
      {open && (
        <div
          className={`absolute bottom-full z-20 mb-2 max-h-80 w-64 overflow-y-auto rounded-xl border border-edge bg-surface-elevated p-1 text-sm ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
        >
          {header && <p className="px-3 py-2 text-xs text-fg-faint">{header}</p>}
          <ul role="listbox" aria-label={label}>
            {options.map((o, i) => (
              <li key={o.key} role="option" aria-selected={o.key === selected}>
                {o.group && o.group !== options[i - 1]?.group && (
                  <div className="px-3 pt-2 pb-1 text-[11px] font-medium tracking-wide text-fg-faint uppercase">
                    {o.group}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => (onSelect(o.key), setOpen(false))}
                  className={`w-full truncate rounded-lg px-3 py-1.5 text-left transition-colors hover:bg-surface-hover ${
                    o.key === selected ? 'text-fg' : 'text-fg-muted'
                  }`}
                >
                  {o.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
