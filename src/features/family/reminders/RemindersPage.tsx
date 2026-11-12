import { useDalon } from '../../../hooks/useDalon'
import { amountDue, isDiscountActive, isMemberVisible, keyDate } from '../../../lib/dalon/selectors'
import { formatMoney } from '../../../lib/money'
import { DeadlineList, type DeadlineItem } from './DeadlineList'
import { FineFeature } from './FineFeature'
import { PushCard } from './PushCard'
import { RemindSettingsPanel } from './RemindSettingsPanel'

/** «Напоминания»: скидка на штраф, ближайшие сроки, каналы и push. */
export function RemindersPage() {
  const { state, charges, now } = useDalon()
  const fine = charges.find((c) => isDiscountActive(c, now))

  const items: DeadlineItem[] = [
    ...charges
      .filter((c) => c.id !== fine?.id)
      .map((c) => ({
        id: c.id,
        date: keyDate(c, now),
        memberId: c.memberId,
        type: c.type,
        title: c.title,
        text: `${formatMoney(amountDue(c, now))} BYN. ${c.payee}.`,
        href: `/family/pay?ids=${c.id}`,
        action: 'Оплатить',
      })),
    ...state.deadlines
      .filter((d) => isMemberVisible(state, d.memberId))
      .map((d) => ({
        id: d.id,
        date: d.dueAt,
        memberId: d.memberId,
        type: d.type === 'car' ? ('car' as const) : ('tax' as const),
        title: d.title,
        text: d.detail,
        href: d.href,
        action: d.action,
      })),
  ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-6 items-start">
      <div className="space-y-6 min-w-0">
        {fine && <FineFeature fine={fine} now={now} />}
        <PushCard />
        <section aria-labelledby="deadlines-title">
          <h2 id="deadlines-title" className="text-lg font-bold text-ink mb-3">
            Ближайшие сроки
          </h2>
          <DeadlineList items={items} now={now} />
        </section>
      </div>
      <RemindSettingsPanel remind={state.remind} />
    </div>
  )
}
