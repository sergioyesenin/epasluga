import type {
  DalonCharge,
  DalonDeadline,
  DalonPerson,
  DalonState,
  TestingKind,
  TestingRegistration,
} from '../../types/dalon'
import { RIKZ, TESTING_KINDS, testingSessions } from '../../data/testing'
import { addApplication, patchApplication } from '../applications'
import { addNotification } from '../notifications'
import { formatDate, isoInDays } from '../dates'
import { formatBYN } from '../money'
import { getDalonState, updateDalon } from './store'
import { withLog } from './log'
import { DALON_APP_PREFIX } from './demo'

/** Что заполнено в мастере регистрации. */
export interface TestingDraft {
  kind: TestingKind
  subjects: string[]
  sessionId: string
  city: string
  point: string
}

export function testingPrice(kind: TestingKind, subjects: number): number {
  return TESTING_KINDS[kind].pricePerSubject * subjects
}

export function testingFor(state: DalonState, memberId: string): TestingRegistration[] {
  return state.testing.filter((t) => t.memberId === memberId)
}

function passNumber(kind: TestingKind): string {
  return `${TESTING_KINDS[kind].short}-${Math.floor(100000 + Math.random() * 899999)}`
}

function passNote(reg: TestingRegistration): string {
  return `Демо. Пропуск ${reg.pass}: ${formatDate(reg.date)}, ${reg.city}, ${reg.point}. Предметы: ${reg.subjects.join(', ')}.`
}

/**
 * Регистрация на РТ / ЦТ / ЦЭ: заявление в «Моих услугах», начисление в «Далони»
 * (если тестирование платное) и напоминание о дне тестирования.
 */
export function registerTesting(person: DalonPerson, draft: TestingDraft, cityName: string) {
  const info = TESTING_KINDS[draft.kind]
  const session = testingSessions(draft.kind).find((s) => s.id === draft.sessionId)
  if (!session) {
    return null
  }
  const stamp = Date.now()
  const amount = testingPrice(draft.kind, draft.subjects.length)
  const paid = amount > 0
  const appId = `${DALON_APP_PREFIX}t-${stamp}`
  const chargeId = paid ? `c-t-${stamp}` : undefined

  const reg: TestingRegistration = {
    id: `t-${stamp}`,
    memberId: person.id,
    kind: draft.kind,
    subjects: draft.subjects,
    date: session.date,
    session: session.label,
    city: cityName,
    point: draft.point,
    status: paid ? 'awaiting-payment' : 'submitted',
    appId,
    chargeId,
    amount,
  }

  const charge: DalonCharge | null = chargeId
    ? {
        id: chargeId,
        memberId: person.id,
        type: 'edu',
        title: `${info.short}: регистрация, ${draft.subjects.join(', ')}`,
        detail: `${session.label}, ${formatDate(session.date)}, ${cityName}. Демо-цена — уточните в РИКЗ`,
        payee: RIKZ,
        amount,
        dueAt: isoInDays(3),
        appId,
      }
    : null

  const deadline: DalonDeadline = {
    id: `d-${reg.id}`,
    memberId: person.id,
    type: 'edu',
    title: `${info.short}, ${person.name}: ${draft.subjects.join(', ')}`,
    detail: `${session.label}, ${draft.point}. Возьмите паспорт и пропуск, приходите за 30 минут.`,
    dueAt: session.date,
    href: '/profile?tab=apps',
    action: 'Мои услуги',
  }

  addApplication({
    id: appId,
    num: String(Math.floor(100000000000000 + Math.random() * 899999999999999)),
    title: `Регистрация на ${info.short}: ${person.name}`,
    serviceId: 'rikz-testing-demo',
    initiator: RIKZ,
    status: paid ? 'Ожидает оплаты' : 'На проверке',
    at: new Date().toISOString(),
    comment: '',
    note: paid
      ? `Демо. Оплатите ${formatBYN(amount)} — после оплаты появится пропуск. ${session.label}, ${formatDate(session.date)}, ${cityName}.`
      : `Демо. Заявка передана в РИКЗ: ${session.label}, ${formatDate(session.date)}, ${cityName}. Подтверждение придёт уведомлением.`,
    payHref: chargeId ? `/family/pay?ids=${chargeId}` : undefined,
  })

  updateDalon((prev) => ({
    ...prev,
    testing: [reg, ...prev.testing],
    charges: charge ? [...prev.charges, charge] : prev.charges,
    deadlines: [...prev.deadlines, deadline],
    log: withLog(
      prev,
      `Регистрация на ${info.short} за ${person.name}: ${draft.subjects.join(', ')}`,
      'you',
    ),
  }))

  addNotification(
    'info',
    `Регистрация на ${info.short}: ${paid ? 'ожидает оплаты' : 'заявка отправлена'}`,
    `${person.full}, ${session.label.toLowerCase()} — ${formatDate(session.date)}, ${draft.point}. Напомним о дне тестирования заранее. Демо: даты и цены уточните в РИКЗ.`,
  )
  return reg
}

/** После оплаты в «Далони»: регистрация подтверждена, в «Моих услугах» — пропуск. */
export function confirmTestingPaid(appIds: string[]) {
  const regs = getDalonState().testing.filter(
    (t) => appIds.includes(t.appId) && t.status === 'awaiting-payment',
  )
  if (regs.length === 0) {
    return
  }
  const done = regs.map((r) => ({
    ...r,
    status: 'registered' as const,
    pass: passNumber(r.kind),
    chargeId: undefined,
  }))
  updateDalon((prev) => ({
    ...prev,
    testing: prev.testing.map((t) => done.find((d) => d.id === t.id) ?? t),
  }))
  done.forEach((r) => {
    patchApplication(r.appId, { status: 'Выполнено', note: passNote(r), payHref: undefined })
    addNotification(
      'info',
      `${TESTING_KINDS[r.kind].short}: регистрация подтверждена`,
      `Пропуск ${r.pass}. ${formatDate(r.date)}, ${r.point}. Скачать пропуск можно в «Моих услугах».`,
    )
  })
}
