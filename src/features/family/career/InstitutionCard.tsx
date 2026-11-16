import { useState } from 'react'
import type { DalonPerson } from '../../../types/dalon'
import { HOME_AREA, type EduInstitution } from '../../../data/career'
import { applyToInstitution } from '../../../lib/dalon/career'
import { showToast } from '../../../lib/toast'
import { quietButton } from '../components/styles'

const selectClass =
  'w-full min-h-11 rounded-control border border-line bg-white px-3 text-[15px] focus:border-family-wine focus:outline-none focus:ring-4 focus:ring-family-wine/15'

type InstitutionCardProps = {
  inst: EduInstitution
  directions: string[]
  person: DalonPerson
}

/** Учебное заведение (условное): где, направление и «Подать документы». */
export function InstitutionCard({ inst, directions, person }: InstitutionCardProps) {
  const [direction, setDirection] = useState(directions[0] ?? '')
  const [sent, setSent] = useState(false)
  const near = inst.area === HOME_AREA
  const selectId = `dir-${inst.id}`

  return (
    <li className="bg-card border border-line rounded-card p-4">
      <h4 className="font-semibold text-ink leading-snug">{inst.name}</h4>
      <p className="text-sm text-muted">
        {inst.area}
        {near && (
          <span className="ml-2 inline-flex rounded-full bg-plant-tint text-plant-ink px-2 py-0.5 text-xs font-semibold">
            Рядом с домом
          </span>
        )}
      </p>
      <label htmlFor={selectId} className="mt-3 block text-sm font-semibold text-ink">
        Направление
      </label>
      <select
        id={selectId}
        className={`${selectClass} mt-1`}
        value={direction}
        onChange={(e) => {
          setDirection(e.target.value)
        }}
      >
        {directions.map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>
      <button
        type="button"
        className={`${quietButton} mt-3 w-full`}
        disabled={sent}
        onClick={() => {
          applyToInstitution(person, inst, direction)
          setSent(true)
          showToast({ tone: 'ok', message: 'Документы поданы — статус в «Моих услугах»' })
        }}
      >
        {sent ? 'Документы поданы' : 'Подать документы'}
      </button>
    </li>
  )
}
