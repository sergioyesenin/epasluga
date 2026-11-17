import { Icon } from '../../../design-system'
import type { DalonState } from '../../../types/dalon'
import { careerFor } from '../../../lib/dalon/career'
import { demoPupil, suggestionsFor } from '../../../lib/dalon/suggestions'
import { testingFor } from '../../../lib/dalon/testing'
import { GradeSwitch } from './GradeSwitch'
import { SuggestionCard } from './SuggestionCard'

/** «Система предлагает»: услуги, которые нужны семье сейчас, — без поиска по каталогу. */
export function SuggestionsPanel({ state, now }: { state: DalonState; now: Date }) {
  const list = suggestionsFor(state, now)
  const pupil = demoPupil(state)

  if (list.length === 0 && !pupil) {
    return null
  }

  return (
    <section
      id="suggestions"
      aria-labelledby="suggestions-title"
      className="mb-10 rounded-[28px] bg-family-wine-tint/70 p-4 md:p-6"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <h2
          id="suggestions-title"
          className="flex items-center gap-2 text-lg font-bold text-family-wine-ink"
        >
          <Icon name="sparkle" className="w-5.5 h-5.5" />
          Система предлагает
        </h2>
        {pupil && <GradeSwitch pupil={pupil} />}
      </div>

      {list.length === 0 ? (
        <p className="text-sm text-muted">
          Сейчас предложений нет. Они появятся сами — например, когда ребёнок пойдёт в 9 или 11
          класс.
        </p>
      ) : (
        <div className="space-y-3">
          {list.map((s) => (
            <SuggestionCard
              key={s.id}
              suggestion={s}
              career={careerFor(state, s.person.id)}
              testing={testingFor(state, s.person.id)}
            />
          ))}
        </div>
      )}
    </section>
  )
}
