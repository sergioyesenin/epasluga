import type { CSSProperties, KeyboardEvent } from 'react'
import clsx from 'clsx'
import { Icon } from '../../../../design-system'
import type { AssetKind } from '../../../../types/dalon'
import type { PlantItem, PlantPartShape } from '../../../../lib/dalon/plant'
import { ASSET_ICON } from '../../components/assetIcon'
import { StatusBadge } from './StatusBadge'

/** Как выглядит часть: молодой лист ростка, лепесток цветка или лист имущества на стебле. */
export type PartLook = 'sprout' | 'petal' | 'stem'

const FILL: Record<PartLook | 'child', string> = {
  sprout: 'fill-plant-sprout group-hover:fill-plant-sprout-hover',
  petal: 'fill-plant-petal-adult group-hover:fill-plant-petal-adult-hover',
  child: 'fill-plant-petal-child group-hover:fill-plant-petal-child-hover',
  stem: 'fill-plant-leaf group-hover:fill-plant-leaf-hover',
}

function fillClass(look: PartLook, item: PlantItem): string {
  if (item.status === 'locked') {
    return 'fill-plant-locked'
  }
  if (look === 'petal' && item.kind === 'child') {
    return FILL.child
  }
  return FILL[look]
}

type PlantPartProps = {
  item: PlantItem
  shape: PlantPartShape
  look: PartLook
  /** Задержка раскрытия при появлении, мс. */
  delay: number
  onPick: (id: string) => void
  onActive: (id: string | null) => void
}

/** Лист или лепесток — кнопка: показывает начисления этого человека или имущества. */
export function PlantPart({ item, shape, look, delay, onPick, onActive }: PlantPartProps) {
  const locked = item.status === 'locked'
  const isAsset = item.kind !== 'adult' && item.kind !== 'child'

  const onKeyDown = (e: KeyboardEvent<SVGGElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onPick(item.id)
    }
  }
  const unfold: CSSProperties = { animationDelay: `${delay}ms` }
  const after: CSSProperties = { animationDelay: `${delay + 260}ms` }

  return (
    <g
      role="button"
      tabIndex={0}
      aria-label={`${item.text}. Показать начисления`}
      className="group cursor-pointer outline-none"
      onClick={() => {
        onPick(item.id)
      }}
      onKeyDown={onKeyDown}
      onMouseEnter={() => {
        onActive(item.id)
      }}
      onMouseLeave={() => {
        onActive(null)
      }}
      onFocus={() => {
        onActive(item.id)
      }}
      onBlur={() => {
        onActive(null)
      }}
    >
      <title>{item.text}</title>
      <g transform={`translate(${shape.origin.x} ${shape.origin.y}) rotate(${shape.angle})`}>
        <g className="motion-safe:animate-plant-unfold" style={unfold}>
          <path
            d={shape.d}
            fill="none"
            className="stroke-family-wine opacity-0 group-focus-visible:opacity-100"
            strokeWidth={7}
          />
          <path
            d={shape.d}
            className={clsx(
              'transition-colors',
              fillClass(look, item),
              locked && 'stroke-muted/60',
              !locked && (look === 'petal' ? 'stroke-family-wine/25' : 'stroke-plant-vein/45'),
            )}
            strokeWidth={locked ? 1.6 : 1.2}
            strokeDasharray={locked ? '5 4' : undefined}
          />
          {shape.vein && (
            <path
              d={shape.vein}
              fill="none"
              className={locked ? 'stroke-muted/40' : 'stroke-plant-vein/50'}
              strokeWidth={1.4}
              strokeLinecap="round"
            />
          )}
        </g>
      </g>
      <g className="motion-safe:animate-fade pointer-events-none" style={after}>
        {isAsset ? (
          <Icon
            name={ASSET_ICON[item.kind as AssetKind]}
            x={shape.label.x - 10}
            y={shape.label.y - 10}
            size={20}
            className={locked ? 'text-muted' : 'text-plant-ink'}
            strokeWidth={2}
          />
        ) : (
          <text
            x={shape.label.x}
            y={shape.label.y + 5}
            textAnchor="middle"
            className={clsx(
              'text-[15px] font-bold tracking-tight',
              locked && 'fill-muted',
              !locked && (look === 'petal' ? 'fill-family-wine-ink' : 'fill-plant-ink'),
            )}
          >
            {item.initials}
          </text>
        )}
        <StatusBadge status={item.status} count={item.count} x={shape.badge.x} y={shape.badge.y} />
      </g>
    </g>
  )
}
