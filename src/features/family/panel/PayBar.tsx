import { formatMoney } from '../../../lib/money'
import { countText } from '../../../lib/dates'
import { actionButton } from '../components/styles'

type PayBarProps = {
  count: number
  total: number
  onPay: () => void
}

/**
 * Панель «Оплатить выбранные» — прилипает к низу экрана.
 * На телефоне стоит над нижними вкладками.
 */
export function PayBar({ count, total, onPay }: PayBarProps) {
  return (
    <div
      role="region"
      aria-label="Оплата выбранного"
      className="sticky z-20 bottom-[calc(4.75rem+env(safe-area-inset-bottom))] md:bottom-4 mt-6"
    >
      <div className="flex items-center gap-3 bg-card border border-line-2 rounded-2xl shadow-lift pl-4 pr-2 py-2">
        <p className="flex-1 min-w-0 leading-tight">
          <span className="block text-xs text-muted">
            {count > 0 ? `Выбрано: ${countText(count, 'начисление', 'начисления', 'начислений')}` : 'Ничего не выбрано'}
          </span>
          <span className="block tabular text-lg font-bold text-ink">{formatMoney(total)} BYN</span>
        </p>
        <button type="button" className={actionButton} disabled={count === 0} onClick={onPay}>
          Оплатить выбранные
        </button>
      </div>
    </div>
  )
}
