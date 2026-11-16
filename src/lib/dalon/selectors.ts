import type {
  DalonAsset,
  DalonCharge,
  DalonMember,
  DalonPerson,
  DalonState,
} from '../../types/dalon'
import { countText, daysUntil } from '../dates'

/** С этого возраста законное представительство прекращается само, без заявлений. */
export const ADULT_AGE = 18

/** Полных лет на дату. */
export function ageOn(birth: string, now = new Date()): number {
  const b = new Date(birth)
  let age = now.getFullYear() - b.getFullYear()
  const beforeBirthday =
    now.getMonth() < b.getMonth() ||
    (now.getMonth() === b.getMonth() && now.getDate() < b.getDate())
  if (beforeBirthday) {
    age -= 1
  }
  return age
}

/** День совершеннолетия: с него законное представительство прекращается. */
export function adulthoodDate(birth: string): string {
  const d = new Date(birth)
  d.setFullYear(d.getFullYear() + ADULT_AGE)
  return d.toISOString()
}

/**
 * Доступ к человеку в «Далони».
 * open — связь ЗАГС действует; closed — закрыта записью о расторжении брака или смерти;
 * adult — ребёнку исполнилось 18, законное представительство прекратилось.
 */
export type PersonAccess = 'open' | 'closed' | 'adult'

export function personAccess(p: DalonPerson, now = new Date()): PersonAccess {
  if (p.closedBy) {
    return 'closed'
  }
  if (p.kind === 'child' && ageOn(p.birth, now) >= ADULT_AGE) {
    return 'adult'
  }
  return 'open'
}

export function personById(state: DalonState, id: string): DalonPerson | undefined {
  return state.people.find((p) => p.id === id)
}

export function assetById(state: DalonState, id: string): DalonAsset | undefined {
  return state.assets.find((a) => a.id === id)
}

/** Семья сейчас: все, чья связь не закрыта записью ЗАГС. */
export function activePeople(state: DalonState): DalonPerson[] {
  return state.people.filter((p) => !p.closedBy)
}

/** Супруг(а) по действующей записи о браке. */
export function activeSpouse(state: DalonState): DalonPerson | undefined {
  return state.people.find((p) => p.basis?.kind === 'marriage' && !p.closedBy)
}

/** Родители детей: вы и супруга, если не поступала запись о смерти. Расторжение брака родителем не лишает. */
export function representatives(state: DalonState): DalonPerson[] {
  return state.people.filter(
    (p) =>
      p.kind === 'adult' &&
      (p.id === 'me' || p.basis?.kind === 'marriage') &&
      p.closedBy?.kind !== 'death',
  )
}

/**
 * Видим ли начисления.
 * Имущество — всегда; человек — пока действует связь ЗАГС, а ребёнок — пока ему нет 18.
 */
export function isMemberVisible(state: DalonState, memberId: string, now = new Date()): boolean {
  const person = personById(state, memberId)
  if (!person) {
    return true
  }
  return personAccess(person, now) === 'open'
}

function ageText(p: DalonPerson, now: Date): string {
  const years = ageOn(p.birth, now)
  if (years >= 1) {
    return countText(years, 'год', 'года', 'лет')
  }
  const days = -daysUntil(p.birth, now)
  if (days < 31) {
    return p.relation === 'Сын' ? 'новорождённый' : 'новорождённая'
  }
  return `${Math.floor(days / 30.4)} мес.`
}

/** «Супруга», «Дочь, 14 лет, 9 класс», «Сын, 4 года, детский сад». */
export function personRole(p: DalonPerson, now = new Date()): string {
  if (p.kind === 'adult') {
    return p.relation
  }
  const parts = [p.relation, ageText(p, now)]
  if (p.school) {
    parts.push(`${p.school.grade} класс`)
  } else if (p.kindergarten) {
    parts.push('детский сад')
  }
  return parts.join(', ')
}

export function personView(p: DalonPerson, now = new Date()): DalonMember {
  return {
    id: p.id,
    name: p.name,
    full: p.full,
    role: personRole(p, now),
    kind: p.kind,
    initials: p.initials,
  }
}

export function assetView(a: DalonAsset): DalonMember {
  return {
    id: a.id,
    name: a.name,
    full: a.full,
    role: `${a.detail}, ${a.owners}`,
    kind: a.kind,
    initials: '',
  }
}

/** Все, к кому относятся начисления: сначала люди, потом имущество. */
export function membersView(state: DalonState, now = new Date()): DalonMember[] {
  return [...state.people.map((p) => personView(p, now)), ...state.assets.map(assetView)]
}

export function memberView(
  state: DalonState,
  id: string,
  now = new Date(),
): DalonMember | undefined {
  const person = personById(state, id)
  if (person) {
    return personView(person, now)
  }
  const asset = assetById(state, id)
  return asset ? assetView(asset) : undefined
}

export function visibleCharges(state: DalonState, now = new Date()): DalonCharge[] {
  return state.charges.filter((c) => isMemberVisible(state, c.memberId, now))
}

/** Статус на растении: есть счёт, всё оплачено или нет доступа. */
export type MemberStatus = 'due' | 'paid' | 'locked'

export function memberStatus(
  state: DalonState,
  memberId: string,
  charges: DalonCharge[],
  now = new Date(),
): MemberStatus {
  if (!isMemberVisible(state, memberId, now)) {
    return 'locked'
  }
  return charges.some((c) => c.memberId === memberId) ? 'due' : 'paid'
}

export function isDiscountActive(c: DalonCharge, now = new Date()): boolean {
  return Boolean(c.discount && daysUntil(c.discount.until, now) >= 0)
}

/** Сумма к оплате сейчас — со скидкой, если она ещё действует. */
export function amountDue(c: DalonCharge, now = new Date()): number {
  if (c.discount && isDiscountActive(c, now)) {
    return Math.round((c.amount * (100 - c.discount.percent)) / 100)
  }
  return c.amount
}

/** Ключевая дата: конец скидки, если она есть, иначе срок оплаты. */
export function keyDate(c: DalonCharge, now = new Date()): string {
  if (c.discount && isDiscountActive(c, now)) {
    return c.discount.until
  }
  return c.dueAt
}

export function sumDue(list: DalonCharge[], now = new Date()): number {
  return list.reduce((acc, c) => acc + amountDue(c, now), 0)
}

export function byKeyDate(now = new Date()) {
  return (a: DalonCharge, b: DalonCharge) =>
    new Date(keyDate(a, now)).getTime() - new Date(keyDate(b, now)).getTime()
}

/** По умолчанию отмечено всё, что нужно оплатить в ближайшие 14 дней. */
export function defaultSelection(list: DalonCharge[], now = new Date()): string[] {
  return list.filter((c) => daysUntil(keyDate(c, now), now) <= 14).map((c) => c.id)
}

export type TimelineItem = {
  id: string
  date: string
  title: string
  memberId: string
  /** Сумма, если это платёж. */
  amount: number | null
  kind: 'charge' | 'deadline'
}

/** Все сроки семьи по порядку: платежи, конец скидок, документы, техосмотр, тестирование. */
export function timeline(state: DalonState, now = new Date()): TimelineItem[] {
  const charges: TimelineItem[] = visibleCharges(state, now).map((c) => ({
    id: c.id,
    date: keyDate(c, now),
    title: isDiscountActive(c, now) ? 'Заканчивается скидка на штраф ГАИ' : c.title,
    memberId: c.memberId,
    amount: amountDue(c, now),
    kind: 'charge',
  }))
  const deadlines: TimelineItem[] = state.deadlines
    .filter((d) => isMemberVisible(state, d.memberId, now))
    .map((d) => ({
      id: d.id,
      date: d.dueAt,
      title: d.title,
      memberId: d.memberId,
      amount: null,
      kind: 'deadline',
    }))
  return [...charges, ...deadlines].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  )
}
