import type {
  ConsentStatus,
  DalonLogEntry,
  DalonPerson,
  DalonState,
  PayMethod,
  PaymentRecord,
  RemindKey,
} from '../../types/dalon'
import { addNotification } from '../notifications'
import { countText } from '../dates'
import { formatMoney } from '../money'
import { getDalonState, updateDalon } from './store'
import { amountDue, isDiscountActive, visibleCharges } from './selectors'

export const METHOD_LABEL: Record<PayMethod, string> = {
  erip: 'ЕРИП',
  card: 'Банковская карта',
}

function logEntry(text: string): DalonLogEntry {
  return {
    id: `l-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    at: new Date().toISOString(),
    text,
  }
}

function withLog(state: DalonState, text: string): DalonState['log'] {
  return [logEntry(text), ...state.log].slice(0, 30)
}

function receiptNumber(method: PayMethod): string {
  const prefix = method === 'erip' ? 'ЕР' : 'БК'
  return `${prefix}-${Math.floor(10000000 + Math.random() * 89999999)}`
}

/**
 * Демо-оплата: начисления уходят в историю с квитанциями.
 * Деньги в Е-Паслуге не хранятся — в жизни платёж инициирует банк через ЕРИП.
 */
export function payCharges(ids: string[], method: PayMethod): PaymentRecord[] {
  const now = new Date()
  const state = getDalonState()
  const list = visibleCharges(state).filter((c) => ids.includes(c.id))
  if (list.length === 0) {
    return []
  }
  const paidAt = now.toISOString()
  const records: PaymentRecord[] = list.map((c) => ({
    id: `h-${Date.now()}-${c.id}`,
    title: isDiscountActive(c, now) ? `Штраф ГАИ: ${c.title.toLowerCase()} (скидка ${c.discount?.percent} %)` : c.title,
    memberId: c.memberId,
    type: c.type,
    payee: c.payee,
    amount: amountDue(c, now),
    paidAt,
    method,
    receipt: receiptNumber(method),
  }))
  const total = records.reduce((acc, r) => acc + r.amount, 0)

  updateDalon((prev) => ({
    ...prev,
    charges: prev.charges.filter((c) => !ids.includes(c.id)),
    history: [...records, ...prev.history],
    log: withLog(prev, `Вы оплатили ${countText(records.length, 'начисление', 'начисления', 'начислений')} на ${formatMoney(total)} BYN`),
  }))

  addNotification(
    'legal',
    `Далонь: оплачено ${formatMoney(total)} BYN`,
    `${countText(records.length, 'начисление', 'начисления', 'начислений')} оплачено через ${METHOD_LABEL[method]}. Квитанции — в «Далони», раздел «История».`,
  )
  return records
}

function patchPerson(id: string, patch: Partial<DalonPerson>, logText: string) {
  updateDalon((prev) => ({
    ...prev,
    people: prev.people.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    log: withLog(prev, logText),
  }))
}

function findPerson(id: string): DalonPerson | undefined {
  return getDalonState().people.find((p) => p.id === id)
}

export function setConsent(id: string, consent: ConsentStatus) {
  const person = findPerson(id)
  if (!person) {
    return
  }
  const texts: Record<ConsentStatus, string> = {
    given: `${person.name} дал(а) согласие на доступ`,
    pending: `Вы отправили запрос на доступ: ${person.name}`,
    revoked: `Вы отозвали доступ: ${person.name}`,
  }
  patchPerson(id, { consent, consentAt: new Date().toISOString() }, texts[consent])
  if (consent === 'given') {
    addNotification('info', `Далонь: ${person.name} — согласие получено`, `${person.full} теперь в вашем семейном пространстве.`)
  }
}

/** Отменить ещё не принятый запрос — человек пропадает из списка. */
export function cancelRequest(id: string) {
  const person = findPerson(id)
  if (!person) {
    return
  }
  updateDalon((prev) => ({
    ...prev,
    people: prev.people.filter((p) => p.id !== id),
    log: withLog(prev, `Вы отменили запрос: ${person.name}`),
  }))
}

export function setRole(id: string, role: 'sees' | 'pays', value: boolean) {
  const person = findPerson(id)
  if (!person) {
    return
  }
  const roleText = role === 'sees' ? 'видит' : 'платит'
  patchPerson(id, { [role]: value }, `${person.name}: «${roleText}» — ${value ? 'включено' : 'выключено'}`)
}

export function addPerson(input: { full: string; relation: string }) {
  const parts = input.full.trim().split(/\s+/)
  const name = parts[1] ?? parts[0]
  const person: DalonPerson = {
    id: `p-${Date.now()}`,
    name,
    full: parts.join(' '),
    relation: input.relation,
    consent: 'pending',
    consentAt: new Date().toISOString(),
    sees: true,
    pays: false,
  }
  updateDalon((prev) => ({
    ...prev,
    people: [...prev.people, person],
    log: withLog(prev, `Вы отправили запрос на доступ: ${name} (${input.relation.toLowerCase()})`),
  }))
  return person
}

export function setRemind(key: RemindKey, value: boolean) {
  updateDalon((prev) => ({ ...prev, remind: { ...prev.remind, [key]: value } }))
}
