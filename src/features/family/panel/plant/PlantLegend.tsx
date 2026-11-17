import type { MemberStatus } from '../../../../lib/dalon/selectors'
import { StatusBadge } from './StatusBadge'

const ITEMS: { status: MemberStatus; count: number; text: string }[] = [
  { status: 'due', count: 2, text: 'есть счета — их число' },
  { status: 'paid', count: 0, text: 'всё оплачено' },
  { status: 'locked', count: 0, text: 'нет доступа' },
]

/** Что значат значки на листьях и лепестках. */
export function PlantLegend() {
  return (
    <ul
      aria-label="Значки на растении"
      className="mt-3 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-muted"
    >
      {ITEMS.map((i) => (
        <li key={i.status} className="inline-flex items-center gap-2">
          <svg viewBox="-12 -12 24 24" className="w-6 h-6 shrink-0" aria-hidden="true">
            <StatusBadge status={i.status} count={i.count} x={0} y={0} />
          </svg>
          {i.text}
        </li>
      ))}
    </ul>
  )
}
