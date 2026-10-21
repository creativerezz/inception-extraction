import { useEffect, useRef } from 'react'
import type { Message } from '../lib/chat'

export function MessageList({ messages, busy }: { messages: Message[]; busy: boolean }) {
  const end = useRef<HTMLDivElement>(null)
  const last = messages.at(-1)
  useEffect(() => {
    // Braces matter: scrollIntoView returns a Promise in current browsers, which React rejects as a cleanup.
    end.current?.scrollIntoView({ block: 'end' })
  }, [messages.length, last?.content, last?.reasoning])

  return (
    <div className="space-y-6 py-6" aria-live="polite">
      {messages.map((m, i) => {
        if (m.role === 'user') {
          return (
            <div key={m.id} className="flex justify-end">
              <div className="max-w-[85%] rounded-2xl bg-surface-alt px-4 py-2.5 whitespace-pre-wrap text-fg">
                {m.content}
              </div>
            </div>
          )
        }
        const streaming = busy && i === messages.length - 1
        return (
          <div key={m.id} className="space-y-2">
            {m.model && <div className="text-xs text-fg-faint">{m.model}</div>}
            {m.reasoning && (
              <details open={streaming && !m.content} className="group rounded-xl border border-edge-dim px-3 py-2">
                <summary className="cursor-pointer text-xs text-fg-muted select-none">
                  {streaming && !m.content ? 'Thinking…' : 'Thought process'}
                </summary>
                <div className="mt-2 max-h-60 overflow-y-auto text-sm leading-relaxed whitespace-pre-wrap text-fg-faint">
                  {m.reasoning}
                </div>
              </details>
            )}
            {m.content ? (
              <div className="leading-relaxed whitespace-pre-wrap text-fg-secondary">{m.content}</div>
            ) : (
              !m.error && !m.reasoning && <div className="text-fg-ghost">{streaming ? 'Waiting for the model…' : '(stopped)'}</div>
            )}
            {m.error && (
              <div className="rounded-xl border border-edge px-3 py-2 text-sm text-fg-muted">Error: {m.error}</div>
            )}
          </div>
        )
      })}
      <div ref={end} />
    </div>
  )
}
