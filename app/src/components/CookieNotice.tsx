import { useState } from 'react'

const KEY = 'cookie-notice-dismissed'

function readDismissed() {
  try {
    return localStorage.getItem(KEY) === '1'
  } catch {
    return false
  }
}

export function CookieNotice() {
  const [dismissed, setDismissed] = useState(readDismissed)
  if (dismissed) return null
  const close = () => {
    setDismissed(true)
    try {
      localStorage.setItem(KEY, '1')
    } catch {
      // Not persisted; it stays closed for this session.
    }
  }
  return (
    <div className="fixed right-0 bottom-0 left-0 z-[100] border-t border-edge bg-surface-alt p-4">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-fg-muted">
          We use cookies and similar technology to improve and personalize your experience.
        </p>
        <button
          type="button"
          onClick={close}
          className="self-start rounded-lg bg-cta px-4 py-1.5 text-sm font-medium text-cta-fg shadow-sm transition-opacity hover:opacity-80 md:self-auto"
        >
          Close
        </button>
      </div>
    </div>
  )
}
