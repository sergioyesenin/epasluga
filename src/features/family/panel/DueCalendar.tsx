import clsx from 'clsx'
import type { TimelineItem } from '../../../lib/dalon/selectors'
import { formatMonth, startOfDay } from '../../../lib/dates'

const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

/** Календарь текущего месяца: точкой отмечены дни со сроками. */
export function DueCalendar({ items, now }: { items: TimelineItem[]; now: Date }) {
  const today = startOfDay(now)
  const year = today.getFullYear()
  const month = today.getMonth()
  const first = new Date(year, month, 1)
  const daysIn = new Date(year, month + 1, 0).getDate()
  const lead = (first.getDay() + 6) % 7

  const marks = new Map<number, string[]>()
  items.forEach((x) => {
    const d = new Date(x.date)
    if (d.getFullYear() === year && d.getMonth() === month) {
      const list = marks.get(d.getDate()) ?? []
      list.push(x.title)
      marks.set(d.getDate(), list)
    }
  })

  const cells = [
    ...Array.from({ length: lead }, (_, i) => <span key={`b${i}`} aria-hidden="true" />),
    ...Array.from({ length: daysIn }, (_, i) => {
      const day = i + 1
      const titles = marks.get(day)
      const isToday = day === today.getDate()
      const past = day < today.getDate()
      return (
        <span
          key={day}
          title={titles?.join('; ')}
          aria-label={titles ? `${day}: ${titles.join('; ')}` : undefined}
          className={clsx(
            'relative h-9 inline-flex items-center justify-center rounded-lg text-sm tabular',
            past ? 'text-muted/60' : 'text-ink',
            isToday && 'ring-1 ring-ink font-semibold',
            titles && 'bg-family-wine-tint text-family-wine-ink font-semibold',
          )}
        >
          {day}
          {titles && (
            <span
              className="absolute bottom-1 w-1 h-1 rounded-full bg-family-wine"
              aria-hidden="true"
            />
          )}
        </span>
      )
    }),
  ]

  return (
    <div aria-label={`Календарь сроков: ${formatMonth(first)}`}>
      <p className="font-semibold text-ink mb-2">{formatMonth(first)}</p>
      <div className="grid grid-cols-7 gap-1 text-center">
        {WEEKDAYS.map((w) => (
          <span key={w} className="text-xs text-muted pb-1" aria-hidden="true">
            {w}
          </span>
        ))}
        {cells}
      </div>
    </div>
  )
}
