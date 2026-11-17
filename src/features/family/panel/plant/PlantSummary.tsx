import { useMemo, useState } from 'react'
import type { DalonCharge, DalonState } from '../../../../types/dalon'
import { FLOWER_MIN_PEOPLE, plantItems } from '../../../../lib/dalon/plant'
import { countText } from '../../../../lib/dates'
import { formatMoney } from '../../../../lib/money'
import { FamilyPlant } from './FamilyPlant'
import { PlantLegend } from './PlantLegend'

type PlantSummaryProps = {
  state: DalonState
  charges: DalonCharge[]
  total: number
  now: Date
  onPick: (memberId: string) => void
}

function modeText(plant: ReturnType<typeof plantItems>): string {
  const who = countText(plant.family, 'человек', 'человека', 'человек')
  const what = countText(plant.assets.length, 'лист', 'листа', 'листьев')
  const locked = plant.people.filter((p) => p.status === 'locked').map((p) => p.name)
  const lockedText = locked.length > 0 ? ` Без доступа: ${locked.join(', ')}.` : ''
  if (plant.mode === 'flower') {
    return `Цветок: ${who} в семье — лепестки, имущество — ${what} на стебле.${lockedText}`
  }
  return `Росток: ${who} в семье, имущество — ${what} на стебле. С ${FLOWER_MIN_PEOPLE} человек росток станет цветком.${lockedText}`
}

/** Растение семьи и сумма к оплате. Нажатие на лист или лепесток ведёт к его начислениям. */
export function PlantSummary({ state, charges, total, now, onPick }: PlantSummaryProps) {
  const plant = useMemo(() => plantItems(state, charges, now), [state, charges, now])
  const [active, setActive] = useState<string | null>(null)
  const activeItem = [...plant.people, ...plant.assets].find((i) => i.id === active)

  return (
    <section aria-labelledby="plant-title" className="w-full max-w-[560px]">
      <h2 id="plant-title" className="sr-only">
        Семья и сумма к оплате
      </h2>
      <div className="relative mx-auto w-full max-w-[300px] sm:max-w-[330px]">
        <FamilyPlant
          key={plant.mode}
          mode={plant.mode}
          people={plant.people}
          assets={plant.assets}
          describedBy="plant-mode"
          onPick={onPick}
          onActive={setActive}
        />
      </div>
      <p aria-hidden="true" className="min-h-6 text-center text-sm font-semibold text-ink">
        {activeItem ? activeItem.text : ''}
      </p>
      <p id="plant-mode" className="mt-1 text-center text-sm text-muted max-w-[46ch] mx-auto">
        {modeText(plant)}
      </p>
      <PlantLegend />

      <div className="mt-5 rounded-[28px] bg-family-hand px-6 sm:px-8 pt-5 pb-6">
        <p className="text-[15px] text-muted">К оплате у семьи</p>
        <p className="mt-1 leading-none">
          <span className="tabular text-[40px] sm:text-[48px] font-bold tracking-tight text-family-wine">
            {formatMoney(total)}
          </span>
          <span className="ml-2 text-xl font-semibold text-muted">BYN</span>
        </p>
        <p className="mt-2 text-[15px] text-muted">
          {charges.length > 0
            ? countText(charges.length, 'начисление', 'начисления', 'начислений')
            : 'Начислений нет'}
        </p>
      </div>
    </section>
  )
}
