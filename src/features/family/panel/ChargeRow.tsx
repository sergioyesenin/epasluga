import clsx from 'clsx'
import { Icon } from '../../../design-system'
import type { DalonCharge } from '../../../types/dalon'
import { formatDay, toneFor, toneText, untilText } from '../../../lib/dates'
import { formatMoney } from '../../../lib/money'
import { amountDue, isDiscountActive, keyDate } from '../../../lib/dalon/selectors'
import { TypeLabel } from '../components/TypeLabel'

type ChargeRowProps = {
  charge: DalonCharge
  checked: boolean
  now: Date
  onToggle: (id: string) => void
}

/** Строка начисления: вся строка — чекбокс «оплатить». */
export function ChargeRow({ charge, checked, now, onToggle }: ChargeRowProps) {
  const date = keyDate(charge, now)
  const discount = isDiscountActive(charge, now)
  const tone = toneFor(date, now)
  const dueText = discount
    ? `Скидка ${charge.discount?.percent} % до ${formatDay(date)}, ${untilText(date, now)}`
    : `До ${formatDay(date)}, ${untilText(date, now)}`

  return (
    <li>
      <label
        className={clsx(
          'flex items-start gap-3 px-4 py-3.5 cursor-pointer transition-colors',
          checked ? 'bg-family-wine-tint/45' : 'hover:bg-soft/60',
        )}
      >
        <input
          type="checkbox"
          className="peer sr-only"
          checked={checked}
          onChange={() => {
            onToggle(charge.id)
          }}
        />
        <span
          aria-hidden="true"
          className={clsx(
            'mt-0.5 w-6 h-6 shrink-0 rounded-md border-2 inline-flex items-center justify-center transition-colors',
            'peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-family-wine',
            checked ? 'bg-family-wine border-family-wine text-white' : 'bg-card border-line-2',
          )}
        >
          {checked && <Icon name="check" className="w-4 h-4" strokeWidth={2.6} />}
        </span>
        <span className="flex-1 min-w-0">
          <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <TypeLabel type={charge.type} />
            <span className={clsx('text-xs font-medium', toneText[tone])}>{dueText}</span>
          </span>
          <span className="block mt-1 font-semibold text-ink leading-snug">{charge.title}</span>
          <span className="block text-sm text-muted leading-snug">{charge.detail}</span>
        </span>
        <span className="text-right shrink-0 tabular">
          {discount && (
            <span className="block text-xs text-muted line-through">
              {formatMoney(charge.amount)}
            </span>
          )}
          <span className="block font-bold text-ink">{formatMoney(amountDue(charge, now))}</span>
          <span className="block text-xs text-muted">BYN</span>
        </span>
      </label>
    </li>
  )
}
