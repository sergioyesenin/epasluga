import { Icon } from '../../../../design-system'
import type { MemberStatus } from '../../../../lib/dalon/selectors'

type StatusBadgeProps = {
  status: MemberStatus
  /** Сколько начислений — цифра на значке «есть счёт». */
  count: number
  x: number
  y: number
}

/**
 * Значок статуса на листе или лепестке. Различается формой, а не только цветом:
 * цифра — есть счета, галочка — всё оплачено, замок — нет доступа.
 */
export function StatusBadge({ status, count, x, y }: StatusBadgeProps) {
  if (status === 'due') {
    return (
      <g transform={`translate(${x} ${y})`}>
        <circle r={10.5} className="fill-family-wine stroke-white" strokeWidth={2} />
        <text y={4} textAnchor="middle" className="fill-white text-[11.5px] font-bold tabular">
          {count}
        </text>
      </g>
    )
  }
  if (status === 'paid') {
    return (
      <g transform={`translate(${x} ${y})`}>
        <circle r={10.5} className="fill-white stroke-plant-stem" strokeWidth={1.6} />
        <path
          d="M-4.5 0.4 L-1.4 3.4 L4.6 -3.4"
          fill="none"
          className="stroke-plant-stem"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    )
  }
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={10.5} className="fill-white stroke-muted" strokeWidth={1.4} />
      <Icon name="lock" x={-6.5} y={-7} size={13} className="text-muted" strokeWidth={2.2} />
    </g>
  )
}
