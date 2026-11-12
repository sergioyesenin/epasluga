import { Link } from 'react-router-dom'
import clsx from 'clsx'
import { Icon } from '../../../design-system'
import type { TimelineItem } from '../../../lib/dalon/selectors'
import { memberById } from '../../../data/dalon'
import { formatDay, toneFor } from '../../../lib/dates'
import { formatMoney } from '../../../lib/money'
import { DueCalendar } from './DueCalendar'
import { textButton } from '../components/styles'

const DOT: Record<ReturnType<typeof toneFor>, string> = {
  overdue: 'bg-bad',
  urgent: 'bg-bad',
  soon: 'bg-warn',
  calm: 'bg-line-2',
}

/** Колонка «Сроки»: календарь и ближайшие даты по порядку. */
export function DuePanel({ items, now }: { items: TimelineItem[]; now: Date }) {
  return (
    <aside
      aria-labelledby="dates-title"
      className="bg-card border border-line rounded-card p-5 lg:sticky lg:top-24 space-y-5"
    >
      <h2 id="dates-title" className="text-lg font-bold text-ink">
        Сроки
      </h2>
      <DueCalendar items={items} now={now} />
      <ol className="relative border-l-2 border-line ml-1.5 space-y-4">
        {items.slice(0, 7).map((x) => {
          const who = memberById(x.memberId)
          return (
            <li key={x.id} className="relative pl-5">
              <span
                className={clsx(
                  'absolute -left-[7px] top-1.5 w-3 h-3 rounded-full ring-4 ring-card',
                  DOT[toneFor(x.date, now)],
                )}
                aria-hidden="true"
              />
              <p className="text-xs text-muted tabular">{formatDay(x.date)}</p>
              <p className="text-sm font-semibold text-ink leading-snug">{x.title}</p>
              <p className="text-xs text-muted">
                {who?.name}
                {x.amount !== null && `, ${formatMoney(x.amount)} BYN`}
              </p>
            </li>
          )
        })}
      </ol>
      <Link to="/family/reminders" className={textButton}>
        <Icon name="bell" className="w-4.5 h-4.5" />
        Настроить напоминания
      </Link>
    </aside>
  )
}
