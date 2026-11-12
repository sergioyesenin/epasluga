import clsx from 'clsx'
import { CHARGE_LABELS } from '../../../data/dalon'
import type { ChargeType } from '../../../types/dalon'

const TONE_CLASS = {
  peach: 'bg-family-peach text-family-peach-ink',
  rose: 'bg-family-rose text-family-rose-ink',
  sand: 'bg-family-sand text-family-sand-ink',
}

/** Цветная метка типа: дети — персик, авто и штрафы — роза, налоги и ЖКХ — песок. */
export function TypeLabel({ type, className }: { type: ChargeType; className?: string }) {
  const label = CHARGE_LABELS[type]
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold leading-5',
        TONE_CLASS[label.tone],
        className,
      )}
    >
      {label.text}
    </span>
  )
}
