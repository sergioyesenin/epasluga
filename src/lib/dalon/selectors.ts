import type {
  DalonCharge,
  DalonMemberId,
  DalonPerson,
  DalonState,
} from '../../types/dalon'
import { daysUntil } from '../dates'

/** Человек из «Семьи и прав», к которому привязаны начисления члена семьи. */
export function personForMember(state: DalonState, memberId: DalonMemberId): DalonPerson | undefined {
  return state.people.find((p) => p.memberId === memberId)
}

/**
 * Видим ли начисления члена семьи.
 * Взрослый — только с его согласия; дети и авто — всегда (законный представитель / владелец).
 */
export function isMemberVisible(state: DalonState, memberId: DalonMemberId): boolean {
  const person = personForMember(state, memberId)
  return !person || person.consent === 'given'
}

export function visibleCharges(state: DalonState): DalonCharge[] {
  return state.charges.filter((c) => isMemberVisible(state, c.memberId))
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
  memberId: DalonMemberId
  /** Сумма, если это платёж. */
  amount: number | null
  kind: 'charge' | 'deadline'
}

/** Все сроки семьи по порядку: платежи, конец скидок, документы, техосмотр. */
export function timeline(state: DalonState, now = new Date()): TimelineItem[] {
  const charges: TimelineItem[] = visibleCharges(state).map((c) => ({
    id: c.id,
    date: keyDate(c, now),
    title: isDiscountActive(c, now) ? 'Заканчивается скидка на штраф ГАИ' : c.title,
    memberId: c.memberId,
    amount: amountDue(c, now),
    kind: 'charge',
  }))
  const deadlines: TimelineItem[] = state.deadlines
    .filter((d) => isMemberVisible(state, d.memberId))
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

export function pendingConsents(state: DalonState): number {
  return state.people.filter((p) => p.consent === 'pending').length
}
