import { track } from '@vercel/analytics'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Composer, type ComposerHandle } from './components/Composer'
import { CookieNotice } from './components/CookieNotice'
import { DiffusionToggle } from './components/DiffusionToggle'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { HistoryDrawer } from './components/HistoryDrawer'
import { MessageList } from './components/MessageList'
import { SuggestedPrompts } from './components/SuggestedPrompts'
import { brand } from './lib/brand'
import { fetchModels, streamReply, type Message, type ModelInfo, type Thinking } from './lib/chat'
import { useTheme } from './lib/useTheme'

type Conversation = { id: string; title: string; messages: Message[] }

const STORAGE_KEY = 'conversations'
const MODEL_KEY = 'model'

function loadConversations(): Conversation[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
  } catch {
    return []
  }
}

export default function App() {
  const { theme, toggle } = useTheme()
  const [historyOpen, setHistoryOpen] = useState(false)
  const [conversations, setConversations] = useState<Conversation[]>(loadConversations)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [diffusion, setDiffusion] = useState(true)
  const [models, setModels] = useState<ModelInfo[] | null>(null)
  const [modelError, setModelError] = useState<string | null>(null)
  const [model, setModel] = useState<ModelInfo | null>(null)
  const [thinking, setThinking] = useState<Thinking>('medium')
  const [busy, setBusy] = useState(false)
  const abort = useRef<AbortController | null>(null)
  const composer = useRef<ComposerHandle>(null)

  useEffect(() => {
    fetchModels()
      .then((list) => {
        setModels(list)
        let saved: string | null = null
        try {
          saved = localStorage.getItem(MODEL_KEY)
        } catch {
          // Fall back to the first model.
        }
        setModel(list.find((m) => `${m.provider}:${m.id}` === saved) ?? list[0] ?? null)
      })
      .catch((err) => setModelError(err instanceof Error ? err.message : String(err)))
  }, [])

  const chooseModel = (m: ModelInfo) => {
    setModel(m)
    try {
      localStorage.setItem(MODEL_KEY, `${m.provider}:${m.id}`)
    } catch {
      // Selection just won't persist.
    }
  }

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations))
    } catch {
      // History just won't persist across reloads.
    }
  }, [conversations])

  const active = conversations.find((c) => c.id === activeId)
  const messages = active?.messages ?? []

  const patch = useCallback((id: string, fn: (msgs: Message[]) => Message[]) => {
    setConversations((cs) => cs.map((c) => (c.id === id ? { ...c, messages: fn(c.messages) } : c)))
  }, [])

  const send = async (text: string) => {
    if (!model) return
    track('chat_sent', { provider: model.provider, model: model.id })
    const user: Message = { id: crypto.randomUUID(), role: 'user', content: text }
    const reply: Message = { id: crypto.randomUUID(), role: 'assistant', content: '', model: model.name }
    let id = activeId
    let history: Message[]
    if (!id || !active) {
      id = crypto.randomUUID()
      history = [user]
      setConversations((cs) => [{ id: id!, title: text.slice(0, 60), messages: [user, reply] }, ...cs])
      setActiveId(id)
    } else {
      history = [...active.messages, user]
      patch(id, (m) => [...m, user, reply])
    }

    const ctrl = new AbortController()
    abort.current = ctrl
    setBusy(true)
    try {
      for await (const snap of streamReply(history, { model, thinking, diffusion, signal: ctrl.signal })) {
        patch(id, (m) => m.map((x) => (x.id === reply.id ? { ...x, ...snap } : x)))
      }
    } catch (err) {
      if (!ctrl.signal.aborted) {
        const message = err instanceof Error ? err.message : String(err)
        patch(id, (m) => m.map((x) => (x.id === reply.id ? { ...x, error: message } : x)))
      }
    } finally {
      setBusy(false)
      abort.current = null
    }
  }

  const stop = () => {
    if (abort.current) track('chat_stopped', { provider: model?.provider ?? 'unknown', model: model?.id ?? 'unknown' })
    abort.current?.abort()
  }
  const goHome = () => {
    stop()
    setActiveId(null)
    setHistoryOpen(false)
  }

  const inChat = messages.length > 0

  const composerEl = (
    <Composer
      ref={composer}
      busy={busy}
      models={models}
      modelError={modelError}
      model={model}
      onModel={chooseModel}
      thinking={thinking}
      onThinking={setThinking}
      onSubmit={send}
      onStop={stop}
    />
  )

  return (
    <div className="flex h-dvh flex-col bg-surface text-fg">
      <Header theme={theme} onToggleTheme={toggle} onOpenHistory={() => setHistoryOpen(true)} onHome={goHome} />

      <HistoryDrawer
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        conversations={conversations}
        activeId={activeId}
        onSelect={(id) => (stop(), setActiveId(id), setHistoryOpen(false))}
        onNew={goHome}
      />

      {inChat ? (
        <>
          <main className="flex-1 overflow-y-auto px-3 sm:px-4">
            <div className="mx-auto w-full max-w-[680px]">
              <MessageList messages={messages} busy={busy} />
            </div>
          </main>
          <div className="px-3 pb-3 sm:px-4 sm:pb-4">
            <div className="mx-auto w-full max-w-[680px]">{composerEl}</div>
          </div>
        </>
      ) : (
        <main className="flex flex-1 flex-col items-center justify-center overflow-y-auto px-3 sm:px-4">
          <div className="w-full max-w-[680px] py-6">
            <Hero />
            <DiffusionToggle
              on={diffusion}
              onChange={(on) => {
                track('diffusion_toggled', { enabled: on })
                setDiffusion(on)
              }}
            />
            {composerEl}
            <SuggestedPrompts
              onPick={(p) => {
                track('prompt_picked', { id: p.id })
                composer.current?.setValue(p.text)
                composer.current?.focus()
              }}
            />
            <p className="mt-4 text-center text-xs text-fg-invisible">
              By messaging {brand.name}, you agree to our{' '}
              <a href={brand.legal.terms} className="text-fg-faint underline-offset-2 hover:underline">
                Terms
              </a>{' '}
              and{' '}
              <a href={brand.legal.privacy} className="text-fg-faint underline-offset-2 hover:underline">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </main>
      )}

      <CookieNotice />
    </div>
  )
}
