import { Link } from 'react-router-dom'
import clsx from 'clsx'
import type { DalonCharge } from '../../../types/dalon'
import { memberById } from '../../../data/dalon'
import { formatDay, toneFor, toneText, untilText } from '../../../lib/dates'
import { formatMoney } from '../../../lib/money'
import { amountDue, keyDate } from '../../../lib/dalon/selectors'
import { TypeLabel } from '../components/TypeLabel'
import { actionButton } from '../components/styles'

/** Главное напоминание: скидка 50 % на штраф скоро закончится. */
export function FineFeature({ fine, now }: { fine: DalonCharge; now: Date }) {
  const until = keyDate(fine, now)
  const who = memberById(fine.memberId)

  return (
    <section
      aria-labelledby="fine-title"
      className="rounded-card border border-family-wine/20 bg-family-wine-tint p-5 md:p-6"
    >
      <p className="flex flex-wrap items-center gap-2 text-sm text-family-wine-ink">
        <TypeLabel type="fine" />
        {who?.full}, {who?.role.split(',')[0]}
      </p>
      <h2 id="fine-title" className="mt-3 text-xl md:text-2xl font-bold text-ink tracking-tight">
        Скидка {fine.discount?.percent} % на штраф — до {formatDay(until)}
      </h2>
      <p className="mt-2 text-ink/80">
        {fine.title}: {fine.detail.charAt(0).toLowerCase() + fine.detail.slice(1)}. Если оплатить до{' '}
        {formatDay(until)}, заплатите{' '}
        <span className="font-semibold">{formatMoney(amountDue(fine, now))} BYN</span> вместо{' '}
        {formatMoney(fine.amount)} BYN.
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-4">
        <Link to={`/family/pay?ids=${fine.id}`} className={actionButton}>
          Оплатить со скидкой
        </Link>
        <span className={clsx('text-sm font-semibold', toneText[toneFor(until, now)])}>
          {untilText(until, now)}
        </span>
      </div>
    </section>
  )
}
