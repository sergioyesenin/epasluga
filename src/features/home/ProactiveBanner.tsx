import { Link } from 'react-router-dom'
import { Icon } from '../../design-system'
import { useDalon } from '../../hooks/useDalon'
import { suggestionsFor } from '../../lib/dalon/suggestions'

/** Плашка на главной: первое предложение системы из «Далони». */
export function ProactiveBanner() {
  const { state, now } = useDalon()
  const first = suggestionsFor(state, now)[0]

  if (!first) {
    return null
  }

  const href =
    first.kind === 'university'
      ? `/family/testing/${first.person.id}`
      : `/family/career/${first.person.id}`

  return (
    <Link
      to={href}
      className="group flex items-center gap-4 rounded-card border border-family-wine/20 bg-family-wine-tint px-4 py-4 md:px-5 hover:border-family-wine/45 transition-colors focus-visible:outline-3 focus-visible:outline-family-wine"
    >
      <span className="w-11 h-11 shrink-0 rounded-full bg-card text-family-wine inline-flex items-center justify-center">
        <Icon name="sparkle" className="w-6 h-6" />
      </span>
      <span className="flex-1 min-w-0">
        <span className="block text-sm text-family-wine-ink/80">Система предлагает</span>
        <span className="block font-semibold text-ink leading-snug">
          {first.kind === 'university'
            ? 'Подать документы в вуз и зарегистрироваться на РТ / ЦТ / ЦЭ'
            : first.title}
        </span>
        <span className="block text-sm text-muted">
          {first.person.name}, {first.person.school?.grade} класс
        </span>
      </span>
      <Icon
        name="chevronRight"
        className="w-6 h-6 shrink-0 text-muted group-hover:text-family-wine transition-colors"
      />
    </Link>
  )
}
