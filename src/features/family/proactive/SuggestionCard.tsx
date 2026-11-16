import { Link } from 'react-router-dom'
import { Icon } from '../../../design-system'
import type { CareerResult, TestingRegistration } from '../../../types/dalon'
import { CAREER_PROFILES } from '../../../data/career'
import { TESTING_KINDS } from '../../../data/testing'
import { dismissSuggestion } from '../../../lib/dalon/actions'
import type { Suggestion } from '../../../lib/dalon/suggestions'
import { formatDate } from '../../../lib/dates'
import { actionButton, quietButton, textButton } from '../components/styles'

const TESTING_STATUS: Record<TestingRegistration['status'], string> = {
  'awaiting-payment': 'ожидает оплаты',
  registered: 'зарегистрирована',
  submitted: 'заявка отправлена',
}

type SuggestionCardProps = {
  suggestion: Suggestion
  career?: CareerResult
  testing: TestingRegistration[]
}

/** Одно предложение системы: что сделать, почему, кнопки и что уже сделано. */
export function SuggestionCard({ suggestion, career, testing }: SuggestionCardProps) {
  const { person, kind } = suggestion
  const careerHref = `/family/career/${person.id}`
  const careerLabel = kind === 'college' ? 'Подобрать колледж' : 'Подобрать вуз'

  return (
    <article className="rounded-card border border-family-wine/15 bg-card p-4 md:p-5">
      <div className="flex gap-3">
        <span className="w-10 h-10 shrink-0 rounded-full bg-family-peach text-family-peach-ink inline-flex items-center justify-center">
          <Icon name="school" className="w-5.5 h-5.5" />
        </span>
        <div className="min-w-0">
          <h3 className="font-semibold text-ink leading-snug">{suggestion.title}</h3>
          <p className="mt-1 text-sm text-muted max-w-[60ch]">{suggestion.text}</p>
        </div>
      </div>

      {career && (
        <p className="mt-3 flex gap-2 text-sm text-ink">
          <Icon name="check" className="w-4.5 h-4.5 shrink-0 mt-0.5 text-ok" strokeWidth={2.4} />
          Тест пройден: {CAREER_PROFILES[career.top].title}
        </p>
      )}

      {testing.length > 0 && (
        <ul className="mt-3 space-y-1.5 text-sm">
          {testing.map((t) => (
            <li key={t.id} className="flex gap-2 text-ink">
              <Icon name="calendar" className="w-4.5 h-4.5 shrink-0 mt-0.5 text-family-wine" />
              <span>
                {TESTING_KINDS[t.kind].short}, {formatDate(t.date)}: {t.subjects.join(', ')} —{' '}
                <span className="font-semibold">{TESTING_STATUS[t.status]}</span>
              </span>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 flex flex-col sm:flex-row sm:flex-wrap gap-2">
        {kind === 'university' && (
          <Link to={`/family/testing/${person.id}`} className={`${actionButton} text-center`}>
            Зарегистрироваться на РТ / ЦТ / ЦЭ
          </Link>
        )}
        <Link
          to={careerHref}
          className={`${kind === 'college' ? actionButton : quietButton} text-center`}
        >
          {career ? careerLabel : 'Пройти тест на профориентацию'}
        </Link>
        {!career && (
          <Link to={`${careerHref}?skip=1`} className={quietButton}>
            {careerLabel} без теста
          </Link>
        )}
        <button
          type="button"
          className={`${textButton} sm:ml-auto self-start sm:self-center`}
          onClick={() => {
            dismissSuggestion(suggestion.id)
          }}
        >
          Не сейчас
        </button>
      </div>
    </article>
  )
}
