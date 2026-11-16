import type { DalonPerson, DalonState } from '../../types/dalon'
import { personAccess } from './selectors'

/**
 * «Система предлагает»: проактивные услуги по данным семьи.
 * Сейчас — по классу школьника: 9 класс → колледж (ССУЗ), 11 класс → вуз и РТ / ЦТ / ЦЭ.
 */
export type SuggestionKind = 'college' | 'university'

export interface Suggestion {
  id: string
  kind: SuggestionKind
  person: DalonPerson
  title: string
  text: string
}

/** Классы, в которых система что-то предлагает — для демо-переключателя. */
export const SUGGESTION_GRADES = [9, 11]

function suggestionFor(p: DalonPerson): Suggestion | null {
  const grade = p.school?.grade
  if (grade === 9) {
    return {
      id: `college-${p.id}`,
      kind: 'college',
      person: p,
      title: 'Подать документы в колледж (ССУЗ)',
      text: `${p.name} в 9 классе — после него можно поступать в колледж. Пройдите тест на профориентацию: подберём специальности и колледжи рядом с домом.`,
    }
  }
  if (grade === 11) {
    return {
      id: `university-${p.id}`,
      kind: 'university',
      person: p,
      title: 'Подать документы в вуз',
      text: `${p.name} в 11 классе — впереди ЦЭ, ЦТ и поступление. Зарегистрируйтесь на тестирование здесь, без сайта РИКЗ, и подберите вуз по результатам теста.`,
    }
  }
  return null
}

export function suggestionsFor(state: DalonState, now = new Date()): Suggestion[] {
  return state.people
    .filter((p) => p.kind === 'child' && personAccess(p, now) === 'open')
    .flatMap((p) => {
      const s = suggestionFor(p)
      return s && !state.dismissed.includes(s.id) ? [s] : []
    })
}

/** Школьник, на котором показываем демо-переключатель класса. */
export function demoPupil(state: DalonState): DalonPerson | undefined {
  return state.people.find((p) => p.kind === 'child' && p.school && !p.closedBy)
}
