import { useEffect } from 'react'
import { CloseIcon, PlusIcon } from './icons'

export type Conversation = { id: string; title: string }

type Props = {
  open: boolean
  onClose: () => void
  conversations: Conversation[]
  activeId: string | null
  onSelect: (id: string) => void
  onNew: () => void
}

export function HistoryDrawer({ open, onClose, conversations, activeId, onSelect, onNew }: Props) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-200 ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden="true"
      />
      <aside
        aria-label="Chat history"
        aria-hidden={!open}
        inert={!open}
        className={`fixed top-0 left-0 z-50 flex h-full w-72 flex-col border-r border-edge bg-surface transition-transform duration-200 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-12 items-center justify-between border-b border-edge-dim px-3 sm:h-14">
          <span className="text-sm font-medium text-fg">History</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close history"
            className="grid h-8 w-8 place-items-center rounded-lg text-fg-muted transition-colors hover:bg-surface-hover hover:text-fg"
          >
            <CloseIcon />
          </button>
        </div>
        <div className="p-3">
          <button
            type="button"
            onClick={onNew}
            className="flex w-full items-center gap-2 rounded-xl border border-edge px-3 py-2 text-sm text-fg transition-colors hover:border-edge-hover hover:bg-surface-hover"
          >
            <PlusIcon /> New chat
          </button>
        </div>
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3">
          {conversations.length === 0 && (
            <p className="px-1 text-[11px] leading-relaxed text-fg-faint">
              Conversations are stored in this browser only. Start a chat and it will appear here.
            </p>
          )}
          {conversations.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => onSelect(c.id)}
              aria-current={c.id === activeId || undefined}
              className={`block w-full truncate rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-surface-hover ${
                c.id === activeId ? 'bg-surface-hover text-fg' : 'text-fg-muted'
              }`}
            >
              {c.title}
            </button>
          ))}
        </nav>
      </aside>
    </>
  )
}
