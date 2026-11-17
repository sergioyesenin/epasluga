import type { DalonPerson, DalonState, ZagsKind, ZagsRecord } from '../../types/dalon'
import { NEWBORN_SEED, ZAGS_DISTRICT } from '../../data/dalon'
import { addNotification } from '../notifications'
import { formatDate, isoInDays } from '../dates'
import { getDalonState, updateDalon } from './store'
import {
  activePeople,
  activeSpouse,
  adulthoodDate,
  personAccess,
  personById,
  representatives,
} from './selectors'
import { withLog } from './log'

/*
 * Связи в семье держатся на записях ЗАГС. Пользователь не может сам добавить
 * или удалить человека: супруг появляется с записью о браке, ребёнок — с записью
 * о рождении; связь закрывают только записи о расторжении брака или о смерти.
 * В прототипе эти записи «поступают из реестра» по демо-кнопкам.
 */

const KIND_TEXT: Record<ZagsKind, string> = {
  marriage: 'о заключении брака',
  birth: 'о рождении',
  divorce: 'о расторжении брака',
  death: 'о смерти',
}

/** «запись ЗАГС о рождении № 902 от 12 апреля 2012 г.» */
export function zagsRecordText(r: ZagsRecord): string {
  return `запись ЗАГС ${KIND_TEXT[r.kind]} № ${r.number} от ${formatDate(r.date)}`
}

/** Почему начисления человека скрыты — или null, если доступ есть. */
export function lockReason(p: DalonPerson, now = new Date()): string | null {
  const access = personAccess(p, now)
  if (access === 'closed' && p.closedBy) {
    const text = zagsRecordText(p.closedBy).replace('запись ЗАГС', 'записью ЗАГС')
    return `Связь закрыта ${text} Начисления больше не показываются, история платежей сохранена.`
  }
  if (access === 'adult') {
    return `С ${formatDate(adulthoodDate(p.birth))} — совершеннолетие: законное представительство прекратилось само. Начисления больше не показываются.`
  }
  return null
}

function newRecord(kind: ZagsKind): ZagsRecord {
  return {
    kind,
    number: String(Math.floor(1000 + Math.random() * 8999)),
    date: new Date().toISOString(),
    office: ZAGS_DISTRICT,
  }
}

function closePerson(person: DalonPerson, record: ZagsRecord) {
  updateDalon((prev) => ({
    ...prev,
    people: prev.people.map((p) =>
      p.id === person.id ? { ...p, closedBy: record, pays: false } : p,
    ),
    log: withLog(
      prev,
      `Реестр ЗАГС: ${zagsRecordText(record)} — связь закрыта: ${person.name}`,
      'zags',
    ),
  }))
}

/** Демо: из реестра поступила запись о расторжении брака — связь с супругой закрывается. */
export function receiveDivorce(): DalonPerson | null {
  const spouse = activeSpouse(getDalonState())
  if (!spouse) {
    return null
  }
  const record = newRecord('divorce')
  closePerson(spouse, record)
  addNotification(
    'legal',
    `Далонь: связь закрыта по записи ЗАГС`,
    `Поступила ${zagsRecordText(record)} ${spouse.name} больше не видит начисления семьи и не платит за неё, её начисления скрыты. Детей это не касается: оба родителя остаются их законными представителями. История платежей сохранена.`,
  )
  return spouse
}

/** Демо: из реестра поступила запись о смерти — связь с человеком закрывается. */
export function receiveDeath(personId: string): DalonPerson | null {
  const person = personById(getDalonState(), personId)
  if (!person || person.closedBy || person.id === 'me') {
    return null
  }
  const record = newRecord('death')
  closePerson(person, record)
  addNotification(
    'legal',
    'Далонь: изменился состав семьи',
    `Поступила ${zagsRecordText(record)}: ${person.full}. Связь в «Далони» закрыта, начисления скрыты, история платежей сохранена. Что оформить дальше — подскажем в «Далони».`,
  )
  return person
}

export function hasNewborn(state: DalonState): boolean {
  return Boolean(personById(state, NEWBORN_SEED.id))
}

/** Демо: запись о рождении — в семье новый человек, связь появляется сама. */
export function receiveBirth(): DalonPerson | null {
  if (hasNewborn(getDalonState())) {
    return null
  }
  const record = newRecord('birth')
  const baby: DalonPerson = { ...NEWBORN_SEED, birth: isoInDays(-4), basis: record }
  updateDalon((prev) => ({
    ...prev,
    people: [...prev.people, baby],
    log: withLog(prev, `Реестр ЗАГС: ${zagsRecordText(record)} — в семье ${baby.name}`, 'zags'),
  }))
  const parents = representatives(getDalonState())
    .map((p) => (p.id === 'me' ? 'вы' : p.name))
    .join(' и ')
  addNotification(
    'legal',
    'Далонь: в семье пополнение',
    `Поступила ${zagsRecordText(record)}: ${baby.full}. Она уже в «Далони», законные представители — ${parents}. Подскажем, что оформить дальше.`,
  )
  return baby
}

/** Кого может касаться демо-запись о смерти: все, чья связь действует, кроме вас. */
export function deathCandidates(state: DalonState): DalonPerson[] {
  return activePeople(state).filter((p) => p.id !== 'me')
}

/**
 * Демо: перевести школьника в другой класс, чтобы показать другие предложения системы.
 * Вместе с классом сдвигаем дату рождения — возраст остаётся правдоподобным.
 */
export function setDemoGrade(personId: string, grade: number) {
  updateDalon((prev) => ({
    ...prev,
    people: prev.people.map((p) => {
      if (p.id !== personId || !p.school) {
        return p
      }
      const shift = grade - p.school.grade
      const birth = new Date(p.birth)
      birth.setFullYear(birth.getFullYear() - shift)
      const basis = p.basis ? { ...p.basis } : undefined
      if (basis) {
        const d = new Date(basis.date)
        d.setFullYear(d.getFullYear() - shift)
        basis.date = d.toISOString()
      }
      return { ...p, birth: birth.toISOString(), basis, school: { ...p.school, grade } }
    }),
  }))
}
