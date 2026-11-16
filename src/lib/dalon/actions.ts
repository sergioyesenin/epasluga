import type { PayMethod, PaymentRecord, RemindKey } from '../../types/dalon'
import { addNotification } from '../notifications'
import { countText } from '../dates'
import { formatMoney } from '../money'
import { getDalonState, updateDalon } from './store'
import { amountDue, isDiscountActive, personById, visibleCharges } from './selectors'
import { withLog } from './log'

export const METHOD_LABEL: Record<PayMethod, string> = {
  erip: 'ЕРИП',
  card: 'Банковская карта',
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
  const list = visibleCharges(state, now).filter((c) => ids.includes(c.id))
  if (list.length === 0) {
    return []
  }
  const paidAt = now.toISOString()
  const records: PaymentRecord[] = list.map((c) => ({
    id: `h-${Date.now()}-${c.id}`,
    title: isDiscountActive(c, now)
      ? `Штраф ГАИ: ${c.title.toLowerCase()} (скидка ${c.discount?.percent} %)`
      : c.title,
    memberId: c.memberId,
    type: c.type,
    payee: c.payee,
    amount: amountDue(c, now),
    paidAt,
    method,
    receipt: receiptNumber(method),
    appId: c.appId,
  }))
  const total = records.reduce((acc, r) => acc + r.amount, 0)

  updateDalon((prev) => ({
    ...prev,
    charges: prev.charges.filter((c) => !ids.includes(c.id)),
    history: [...records, ...prev.history],
    log: withLog(
      prev,
      `Вы оплатили ${countText(records.length, 'начисление', 'начисления', 'начислений')} на ${formatMoney(total)} BYN`,
      'you',
    ),
  }))

  addNotification(
    'legal',
    `Далонь: оплачено ${formatMoney(total)} BYN`,
    `${countText(records.length, 'начисление', 'начисления', 'начислений')} оплачено через ${METHOD_LABEL[method]}. Квитанции — в «Далони», раздел «История».`,
  )
  return records
}

/**
 * «Платит»: может ли взрослый оплачивать начисления семьи.
 * Это решают сами супруги, а не ЗАГС: переключатель остаётся у взрослых.
 */
export function setPays(id: string, value: boolean) {
  const person = personById(getDalonState(), id)
  if (!person || person.closedBy) {
    return
  }
  updateDalon((prev) => ({
    ...prev,
    people: prev.people.map((p) => (p.id === id ? { ...p, pays: value } : p)),
    log: withLog(prev, `${person.name}: «платит» — ${value ? 'включено' : 'выключено'}`, 'family'),
  }))
}

export function setRemind(key: RemindKey, value: boolean) {
  updateDalon((prev) => ({ ...prev, remind: { ...prev.remind, [key]: value } }))
}

/** «Не сейчас» у предложения системы: скрыть до сброса демо. */
export function dismissSuggestion(id: string) {
  updateDalon((prev) => ({
    ...prev,
    dismissed: prev.dismissed.includes(id) ? prev.dismissed : [...prev.dismissed, id],
  }))
}
