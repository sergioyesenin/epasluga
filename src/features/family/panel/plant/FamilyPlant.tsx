import {
  FLOWER_CENTER,
  FLOWER_DISC,
  PLANT_BASE,
  SPROUT_CROWN,
  flowerPetals,
  plantView,
  sproutLeaves,
  stemLeaves,
  stemPath,
  type PlantItem,
  type PlantMode,
} from '../../../../lib/dalon/plant'
import { PlantPart } from './PlantPart'

type FamilyPlantProps = {
  mode: PlantMode
  people: PlantItem[]
  assets: PlantItem[]
  /** id подписи с описанием рисунка. */
  describedBy: string
  onPick: (id: string) => void
  onActive: (id: string | null) => void
}

/** Семечки в сердцевине цветка — по спирали, как у подсолнуха. */
const SEEDS = Array.from({ length: 13 }, (_, i) => {
  const a = i * 137.5 * (Math.PI / 180)
  const r = 3.6 * Math.sqrt(i + 0.6)
  return { x: FLOWER_CENTER.x + r * Math.cos(a), y: FLOWER_CENTER.y + r * Math.sin(a) }
})

/**
 * Растение семьи. Стебель с листьями-имуществом растёт из земли,
 * наверху — росток (до 4 человек) или цветок (5 и больше): люди — его листья или лепестки.
 */
export function FamilyPlant({
  mode,
  people,
  assets,
  describedBy,
  onPick,
  onActive,
}: FamilyPlantProps) {
  const leafShapes = stemLeaves(assets.length)
  const topShapes = mode === 'flower' ? flowerPetals(people.length) : sproutLeaves(people.length)
  const topDelay = 320 + assets.length * 90

  return (
    <svg
      viewBox={plantView(mode)}
      role="group"
      aria-label={mode === 'flower' ? 'Цветок семьи' : 'Росток семьи'}
      aria-describedby={describedBy}
      className="w-full h-auto overflow-visible"
    >
      <ellipse
        cx={PLANT_BASE.x}
        cy={PLANT_BASE.y + 6}
        rx={118}
        ry={14}
        className="fill-plant-soil"
      />
      <ellipse
        cx={PLANT_BASE.x}
        cy={PLANT_BASE.y + 3}
        rx={64}
        ry={7}
        className="fill-family-hand-hover"
      />

      <path
        d={stemPath(mode)}
        pathLength={1}
        strokeDasharray="1"
        fill="none"
        className="stroke-plant-stem motion-safe:animate-plant-grow"
        strokeWidth={5}
        strokeLinecap="round"
      />

      {assets.map((item, i) => (
        <PlantPart
          key={item.id}
          item={item}
          shape={leafShapes[i]}
          look="stem"
          delay={320 + i * 90}
          onPick={onPick}
          onActive={onActive}
        />
      ))}

      {mode === 'sprout' && (
        <circle
          cx={SPROUT_CROWN.x}
          cy={SPROUT_CROWN.y}
          r={6}
          className="fill-plant-stem motion-safe:animate-fade"
          style={{ animationDelay: `${topDelay - 100}ms` }}
        />
      )}

      {people.map((item, i) => (
        <PlantPart
          key={item.id}
          item={item}
          shape={topShapes[i]}
          look={mode === 'flower' ? 'petal' : 'sprout'}
          delay={topDelay + i * 80}
          onPick={onPick}
          onActive={onActive}
        />
      ))}

      {mode === 'flower' && (
        <g
          className="motion-safe:animate-fade pointer-events-none"
          style={{ animationDelay: `${topDelay}ms` }}
        >
          <circle
            cx={FLOWER_CENTER.x}
            cy={FLOWER_CENTER.y}
            r={FLOWER_DISC}
            className="fill-family-orange stroke-family-wine/25"
            strokeWidth={1.5}
          />
          {SEEDS.map((s) => (
            <circle
              key={`${s.x}-${s.y}`}
              cx={s.x}
              cy={s.y}
              r={1.7}
              className="fill-family-wine-deep/35"
            />
          ))}
        </g>
      )}
    </svg>
  )
}
