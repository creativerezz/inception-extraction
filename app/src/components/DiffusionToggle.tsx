type Props = { on: boolean; onChange: (on: boolean) => void }

export function DiffusionToggle({ on, onChange }: Props) {
  return (
    <div className="mb-3 flex justify-end">
      <button
        type="button"
        aria-pressed={on}
        onClick={() => onChange(!on)}
        className="flex items-center gap-2 rounded-full border border-edge bg-surface-alt px-3 py-1.5 text-xs text-fg transition-colors hover:border-edge-hover sm:gap-2.5 sm:px-4 sm:py-2 sm:text-sm"
      >
        Diffusion Effect
        <span
          aria-hidden="true"
          className={`relative h-5 w-9 rounded-full transition-colors ${on ? 'bg-toggle-on' : 'bg-toggle-off'}`}
        >
          <span
            className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full transition-transform ${
              on ? 'translate-x-4 bg-toggle-on-knob' : 'bg-toggle-knob'
            }`}
          />
        </span>
      </button>
    </div>
  )
}
