import { useId, useState } from 'react'
import { prompts, shuffled, type Prompt } from '../lib/prompts'
import { ChevronDownIcon, SparkIcon } from './icons'

export function SuggestedPrompts({ onPick }: { onPick: (p: Prompt) => void }) {
  const [open, setOpen] = useState(false)
  const [order] = useState(() => shuffled(prompts))
  const listId = useId()

  return (
    <div className="mt-3">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between rounded-xl border border-edge bg-surface-alt px-4 py-2.5 transition-colors hover:border-edge-hover"
      >
        <span className="flex items-center gap-2.5 text-sm font-medium text-fg">
          <SparkIcon className="text-fg-muted" />
          Try Suggested Prompt
        </span>
        <span className="grid h-7 w-7 place-items-center rounded-full bg-surface-hover text-fg-muted">
          {/* Points up when collapsed, down when open — matches the source. */}
          <ChevronDownIcon className={`transition-transform duration-200 ${open ? '' : 'rotate-180'}`} />
        </span>
      </button>

      <div className="prompt-expander" data-open={open} id={listId} inert={!open}>
        <div className="overflow-hidden">
          <div className="mt-2 max-h-64 space-y-1.5 overflow-y-auto">
            {order.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => onPick(p)}
                className="w-full rounded-xl border border-transparent bg-surface-alt px-4 py-2.5 text-left transition-colors hover:border-edge"
              >
                <div className="text-sm font-medium text-fg">{p.title}</div>
                {p.description && <div className="line-clamp-1 text-xs text-fg-faint">{p.description}</div>}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
