import type { CareerProfileId, CareerResult, DalonPerson, DalonState } from '../../types/dalon'
import {
  CAREER_PROFILES,
  EDU_INSTITUTIONS,
  HOME_AREA,
  type EduInstitution,
  type EduLevel,
} from '../../data/career'
import { addApplication } from '../applications'
import { addNotification } from '../notifications'
import { updateDalon } from './store'
import { withLog } from './log'
import { DALON_APP_PREFIX } from './demo'

/** Ответы теста: id вопроса → профиль выбранного варианта. */
export type CareerAnswers = Record<string, CareerProfileId>

const PROFILE_ORDER = Object.keys(CAREER_PROFILES) as CareerProfileId[]

export function scoreAnswers(answers: CareerAnswers): Record<CareerProfileId, number> {
  const scores = Object.fromEntries(PROFILE_ORDER.map((id) => [id, 0])) as Record<
    CareerProfileId,
    number
  >
  Object.values(answers).forEach((profile) => {
    scores[profile] += 1
  })
  return scores
}

/** Профили по убыванию баллов; при равенстве — в порядке справочника. */
export function rankProfiles(scores: Record<CareerProfileId, number>): CareerProfileId[] {
  return [...PROFILE_ORDER].sort((a, b) => scores[b] - scores[a])
}

export function saveCareerResult(person: DalonPerson, answers: CareerAnswers): CareerResult {
  const scores = scoreAnswers(answers)
  const result: CareerResult = {
    memberId: person.id,
    at: new Date().toISOString(),
    scores,
    top: rankProfiles(scores)[0],
  }
  updateDalon((prev) => ({
    ...prev,
    career: [result, ...prev.career.filter((c) => c.memberId !== person.id)],
    log: withLog(
      prev,
      `Тест на профориентацию пройден: ${person.name} — ${CAREER_PROFILES[result.top].title}`,
      'family',
    ),
  }))
  return result
}

export function careerFor(state: DalonState, memberId: string): CareerResult | undefined {
  return state.career.find((c) => c.memberId === memberId)
}

/** После 9 класса — колледж, после 11 — вуз. */
export function eduLevelFor(person: DalonPerson): EduLevel {
  return (person.school?.grade ?? 0) >= 10 ? 'university' : 'college'
}

/** Учреждения в городе по профилю: сначала рядом с домом, потом остальные. */
export function institutionsFor(
  profiles: CareerProfileId[],
  level: EduLevel,
  city: string,
): EduInstitution[] {
  const rank = (i: EduInstitution) => {
    const match = profiles.findIndex((p) => i.profiles.includes(p))
    return match === -1 ? 99 : match
  }
  return EDU_INSTITUTIONS.filter((i) => i.city === city && i.level === level && rank(i) < 99).sort(
    (a, b) => rank(a) - rank(b) || Number(b.area === HOME_AREA) - Number(a.area === HOME_AREA),
  )
}

/** Демо: заявление о приёме в «Мои услуги». В жизни — после выпускных экзаменов и по правилам приёма. */
export function applyToInstitution(person: DalonPerson, inst: EduInstitution, direction: string) {
  const level = inst.level === 'college' ? 'колледж' : 'вуз'
  addApplication({
    id: `${DALON_APP_PREFIX}edu-${Date.now()}`,
    num: String(Math.floor(100000000000000 + Math.random() * 899999999999999)),
    title: `Документы в ${level}: ${person.name}`,
    serviceId: 'edu-admission-demo',
    initiator: inst.name,
    status: 'На проверке',
    at: new Date().toISOString(),
    comment: '',
    note: `Демо. ${direction}, ${inst.name}. Учреждение условное, не официальный перечень.`,
  })
  updateDalon((prev) => ({
    ...prev,
    log: withLog(prev, `Документы в ${level} за ${person.name}: ${inst.name}`, 'you'),
  }))
  addNotification(
    'info',
    `Документы в ${level} поданы`,
    `${person.full}: ${direction}, ${inst.name}. Статус — в «Моих услугах». Демо: учреждение условное.`,
  )
}
