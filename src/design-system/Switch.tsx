import type { ReactNode } from 'react'
import clsx from 'clsx'

type SwitchProps = {
  checked: boolean
  onChange: (next: boolean) => void
  label: ReactNode
  hint?: ReactNode
  disabled?: boolean
  /** Цвет включённого состояния: синий по умолчанию, бордо — в «Далони». */
  tone?: 'navy' | 'family'
}

/** Переключатель «вкл/выкл» с подписью. Вся строка — зона нажатия не меньше 44px. */
export function Switch({ checked, onChange, label, hint, disabled, tone = 'navy' }: SwitchProps) {
  return (
    <label
      className={clsx(
        'flex items-start gap-3 min-h-11 py-2 select-none',
        disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
      )}
    >
      <input
        type="checkbox"
        role="switch"
        className="peer sr-only"
        checked={checked}
        disabled={disabled}
        onChange={(e) => {
          onChange(e.target.checked)
        }}
      />
      <span
        aria-hidden="true"
        className={clsx(
          'relative mt-0.5 w-10 h-6 shrink-0 rounded-full transition-colors',
          'peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2',
          tone === 'family' ? 'peer-focus-visible:outline-family-wine' : 'peer-focus-visible:outline-navy',
          checked ? (tone === 'family' ? 'bg-family-wine' : 'bg-navy') : 'bg-line-2',
        )}
      >
        <span
          className={clsx(
            'absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform',
            checked && 'translate-x-4',
          )}
        />
      </span>
      <span className="flex flex-col">
        <span className="text-[15px] text-ink leading-snug">{label}</span>
        {hint && <span className="text-xs text-muted mt-0.5">{hint}</span>}
      </span>
    </label>
  )
}
