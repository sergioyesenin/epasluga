import { Link } from 'react-router-dom'
import clsx from 'clsx'
import { Icon } from '../../design-system'
import { useDalon } from '../../hooks/useDalon'
import { memberById } from '../../data/dalon'
import { countText, formatDay, toneFor, toneText, untilText } from '../../lib/dates'
import { formatMoney } from '../../lib/money'
import { DalonMark } from '../family/components/DalonMark'

/** Плашка «Далони» на главной: сколько к оплате и ближайший срок. */
export function DalonSummary() {
  const { charges, total, timeline, now } = useDalon()
  const next = timeline[0]

  return (
    <Link
      to="/family"
      className="group block bg-card border border-line rounded-card p-5 md:p-6 hover:border-family-wine/40 transition-colors focus-visible:outline-3 focus-visible:outline-family-wine"
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
        <div className="flex items-center gap-3">
          <DalonMark className="w-10 h-10 text-family-wine shrink-0" />
          <div>
            <p className="font-semibold text-ink">Далонь</p>
            <p className="text-sm text-muted">Платежи всей семьи</p>
          </div>
        </div>
        <div className="sm:border-l sm:border-line sm:pl-8">
          <p className="text-sm text-muted">К оплате у семьи</p>
          <p className="tabular text-[28px] font-bold tracking-tight text-family-wine leading-tight">
            {formatMoney(total)} <span className="text-base font-semibold text-muted">BYN</span>
          </p>
          <p className="text-xs text-muted">
            {countText(charges.length, 'начисление', 'начисления', 'начислений')}
          </p>
        </div>
        {next && (
          <div className="flex-1 min-w-0 sm:border-l sm:border-line sm:pl-8">
            <p className="text-sm text-muted">Ближайший срок</p>
            <p className="font-semibold text-ink leading-snug">
              {next.title}
              {next.amount !== null && `, ${formatMoney(next.amount)} BYN`}
            </p>
            <p className={clsx('text-sm', toneText[toneFor(next.date, now)])}>
              {memberById(next.memberId)?.name} · до {formatDay(next.date)},{' '}
              {untilText(next.date, now)}
            </p>
          </div>
        )}
        <Icon
          name="chevronRight"
          className="hidden sm:block w-6 h-6 text-muted group-hover:text-family-wine transition-colors"
        />
      </div>
    </Link>
  )
}
