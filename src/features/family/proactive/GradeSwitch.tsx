import clsx from 'clsx'
import type { DalonPerson } from '../../../types/dalon'
import { SUGGESTION_GRADES } from '../../../lib/dalon/suggestions'
import { setDemoGrade } from '../../../lib/dalon/zags'
import { DemoBadge } from '../components/DemoBadge'

/** Демо: перевести школьника в другой класс, чтобы увидеть второй сценарий предложений. */
export function GradeSwitch({ pupil }: { pupil: DalonPerson }) {
  const grade = pupil.school?.grade
  return (
    <fieldset className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
      <legend className="sr-only">Демо: в каком классе {pupil.name}</legend>
      <DemoBadge />
      <span aria-hidden="true" className="text-muted">
        {pupil.name} в классе
      </span>
      <span className="inline-flex rounded-control border border-line-2 bg-card p-0.5">
        {SUGGESTION_GRADES.map((g) => (
          <label
            key={g}
            className={clsx(
              'inline-flex items-center justify-center min-h-10 min-w-12 px-3 rounded-[10px] font-semibold cursor-pointer transition-colors',
              'has-focus-visible:outline-3 has-focus-visible:outline-family-wine',
              g === grade
                ? 'bg-family-wine text-white'
                : 'text-family-wine-ink hover:bg-family-wine-tint',
            )}
          >
            <input
              type="radio"
              name="demo-grade"
              className="sr-only"
              checked={g === grade}
              onChange={() => {
                setDemoGrade(pupil.id, g)
              }}
            />
            {g}
          </label>
        ))}
      </span>
    </fieldset>
  )
}
