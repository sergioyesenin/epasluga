import { Link } from 'react-router-dom'
import clsx from 'clsx'
import { EmptyState, Icon } from '../../../design-system'
import type { ChargeType } from '../../../types/dalon'
import { memberById } from '../../../data/dalon'
import { formatDayParts, toneFor, toneText, untilText } from '../../../lib/dates'
import { TypeLabel } from '../components/TypeLabel'
import { quietButton } from '../components/styles'

export type DeadlineItem = {
  id: string
  date: string
  memberId: string
  type: ChargeType
  title: string
  text: string
  href: string
  action: string
}

/** Список ближайших сроков с датой-плашкой слева. */
export function DeadlineList({ items, now }: { items: DeadlineItem[]; now: Date }) {
  if (items.length === 0) {
    return (
      <EmptyState
        icon={<Icon name="calendar" />}
        title="Сроков нет"
        description="Когда появятся начисления или подойдёт срок документа, напоминание будет здесь."
      />
    )
  }

  return (
    <ol className="space-y-3">
      {items.map((x) => {
        const parts = formatDayParts(x.date)
        const tone = toneFor(x.date, now)
        return (
          <li key={x.id} className="flex gap-4 bg-card border border-line rounded-card p-4">
            <span
              className={clsx(
                'w-14 shrink-0 rounded-xl flex flex-col items-center justify-center py-2',
                tone === 'urgent' || tone === 'overdue' ? 'bg-bad-tint text-bad' : 'bg-soft text-ink',
              )}
            >
              <span className="text-xl font-bold leading-none tabular">{parts.day}</span>
              <span className="text-xs mt-1">{parts.month}</span>
            </span>
            <div className="flex-1 min-w-0">
              <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
                <TypeLabel type={x.type} />
                <span className="text-muted">{memberById(x.memberId)?.name}</span>
                <span className={clsx('font-semibold', toneText[tone])}>{untilText(x.date, now)}</span>
              </p>
              <h3 className="mt-1 font-semibold text-ink leading-snug">{x.title}</h3>
              <p className="text-sm text-muted">{x.text}</p>
              <Link to={x.href} className={`${quietButton} mt-3 text-sm`}>
                {x.action}
              </Link>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
