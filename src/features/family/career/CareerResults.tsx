import { useState } from 'react'
import clsx from 'clsx'
import { Icon } from '../../../design-system'
import type { CareerProfileId, CareerResult, DalonPerson } from '../../../types/dalon'
import { FAMILY_HOME } from '../../../data/dalon'
import { CAREER_DISCLAIMER, CAREER_PROFILES, EDU_CITIES, type EduLevel } from '../../../data/career'
import { eduLevelFor, institutionsFor, rankProfiles } from '../../../lib/dalon/career'
import { DemoBadge } from '../components/DemoBadge'
import { textButton } from '../components/styles'
import { InstitutionCard } from './InstitutionCard'

const selectClass =
  'w-full min-h-11 rounded-control border border-field bg-white px-3 text-[15px] focus:border-family-wine focus:outline-none focus:ring-4 focus:ring-family-wine/15'

const chipClass = (on: boolean) =>
  clsx(
    'inline-flex items-center min-h-10 px-3.5 rounded-full border text-sm font-semibold cursor-pointer transition-colors',
    'has-focus-visible:outline-3 has-focus-visible:outline-family-wine',
    on
      ? 'border-family-wine bg-family-wine text-white'
      : 'border-line-2 bg-card text-family-wine-ink hover:border-family-wine/50',
  )

const LEVELS: { id: EduLevel; label: string }[] = [
  { id: 'college', label: 'Колледж — после 9 класса' },
  { id: 'university', label: 'Вуз — после 11 класса' },
]

type CareerResultsProps = {
  person: DalonPerson
  result?: CareerResult
  onRetake: () => void
}

/** Результат теста: профиль, направления и учебные заведения рядом с домом (условные). */
export function CareerResults({ person, result, onRetake }: CareerResultsProps) {
  const [profile, setProfile] = useState<CareerProfileId>(result?.top ?? 'tech')
  const [level, setLevel] = useState<EduLevel>(eduLevelFor(person))
  const [city, setCity] = useState(FAMILY_HOME.city)

  const info = CAREER_PROFILES[profile]
  const directions = level === 'college' ? info.college : info.university
  const list = institutionsFor([profile], level, city)
  const top = result ? rankProfiles(result.scores).slice(0, 3) : []
  const answered = result ? Object.values(result.scores).reduce((a, b) => a + b, 0) : 0
  const cityName = EDU_CITIES.find((c) => c.id === city)?.name ?? ''

  return (
    <div className="space-y-6">
      <section
        aria-labelledby="career-profile"
        className="bg-card border border-line rounded-card p-5 md:p-7"
      >
        {result ? (
          <>
            <p className="text-sm text-muted">Профиль, который ближе всего {person.name}</p>
            <h2
              id="career-profile"
              className="mt-1 text-2xl md:text-[28px] font-bold text-family-wine tracking-tight"
            >
              {CAREER_PROFILES[result.top].title}
            </h2>
            <p className="mt-2 text-ink max-w-[60ch]">{CAREER_PROFILES[result.top].text}</p>
            <ul className="mt-5 space-y-2.5 max-w-md">
              {top.map((id) => (
                <li key={id} className="text-sm">
                  <span className="flex justify-between text-ink">
                    {CAREER_PROFILES[id].title}
                    <span className="tabular text-muted">
                      {result.scores[id]} из {answered}
                    </span>
                  </span>
                  <span className="mt-1 block h-2 rounded-full bg-family-wine-tint overflow-hidden">
                    <span
                      className="block h-full rounded-full bg-family-orange"
                      style={{ width: `${(result.scores[id] / answered) * 100}%` }}
                    />
                  </span>
                </li>
              ))}
            </ul>
            <button type="button" className={`${textButton} mt-4`} onClick={onRetake}>
              <Icon name="refresh" className="w-4.5 h-4.5" />
              Пройти тест заново
            </button>
          </>
        ) : (
          <>
            <h2 id="career-profile" className="text-2xl font-bold text-ink">
              Подбор без теста
            </h2>
            <p className="mt-2 text-muted max-w-[60ch]">
              Выберите, что ближе {person.name}, — покажем направления и учебные заведения. Тест из
              10 вопросов поможет, если сложно решить.
            </p>
            <button type="button" className={`${textButton} mt-3`} onClick={onRetake}>
              Пройти тест
            </button>
          </>
        )}
      </section>

      <section aria-labelledby="career-pick" className="space-y-4">
        <h2 id="career-pick" className="text-lg font-bold text-ink">
          Направления и учебные заведения
        </h2>
        <fieldset>
          <legend className="text-sm font-semibold text-ink mb-2">Профиль</legend>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(CAREER_PROFILES) as CareerProfileId[]).map((id) => (
              <label key={id} className={chipClass(id === profile)}>
                <input
                  type="radio"
                  name="career-profile"
                  className="sr-only"
                  checked={id === profile}
                  onChange={() => {
                    setProfile(id)
                  }}
                />
                {CAREER_PROFILES[id].title}
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="text-sm font-semibold text-ink mb-2">Куда поступать</legend>
          <div className="flex flex-wrap gap-2">
            {LEVELS.map((l) => (
              <label key={l.id} className={chipClass(l.id === level)}>
                <input
                  type="radio"
                  name="career-level"
                  className="sr-only"
                  checked={l.id === level}
                  onChange={() => {
                    setLevel(l.id)
                  }}
                />
                {l.label}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="rounded-card bg-family-peach/60 p-4">
          <p className="font-semibold text-family-peach-ink">Направления подготовки</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {directions.map((d) => (
              <li key={d} className="rounded-full bg-card px-3 py-1 text-sm text-ink">
                {d}
              </li>
            ))}
          </ul>
          {level === 'university' && (
            <p className="mt-3 text-sm text-family-peach-ink">
              На ЦЭ и ЦТ обычно нужны: {info.subjects.join(', ').toLowerCase()}. Точный перечень — в
              правилах приёма выбранного вуза.
            </p>
          )}
        </div>

        <div className="max-w-xs">
          <label htmlFor="career-city" className="block text-sm font-semibold text-ink">
            Город
          </label>
          <select
            id="career-city"
            className={`${selectClass} mt-1`}
            value={city}
            onChange={(e) => {
              setCity(e.target.value)
            }}
          >
            {EDU_CITIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
                {c.id === FAMILY_HOME.city ? ' — по месту жительства' : ''}
              </option>
            ))}
          </select>
        </div>

        <p className="flex flex-wrap items-center gap-2 text-sm text-muted">
          <DemoBadge />
          {CAREER_DISCLAIMER} Названия и специальности придуманы для прототипа.
        </p>

        {list.length === 0 ? (
          <p className="text-sm text-muted">
            В городе {cityName} по этому профилю ничего не нашли. Выберите другой город.
          </p>
        ) : (
          <ul aria-label={`Учебные заведения: ${cityName}`} className="grid sm:grid-cols-2 gap-3">
            {list.map((inst) => (
              <InstitutionCard
                key={`${inst.id}-${profile}`}
                inst={inst}
                directions={directions}
                person={person}
              />
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
