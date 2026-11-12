import type { Charge, FamilyMember, Payment } from '../types/service'

/**
 * Демо-семья: я, жена, двое детей и кот (поло).
 * Всего 5 — значит, на дашборде покажется цветок.
 * Чтобы проверить росток — удалите одного члена или поднимите
 * STEM_TO_FLOWER_THRESHOLD до 6.
 */
export const family: FamilyMember[] = [
  {
    id: 'm-me',
    name: 'Алексей Сергеевич',
    initials: 'Ал',
    role: 'me',
    avatarTint: 'sand',
    dueAmount: 0,
    paidAmount: 0,
    status: 'paid',
  },
  {
    id: 'm-anna',
    name: 'Анна',
    initials: 'Ан',
    role: 'adult',
    avatarTint: 'tint-navy',
    dueAmount: 0,
    paidAmount: 0,
    status: 'paid',
  },
  {
    id: 'm-masha',
    name: 'Маша',
    initials: 'Ма',
    role: 'child',
    avatarTint: 'peach',
    dueAmount: 0,
    paidAmount: 0,
    status: 'paid',
  },
  {
    id: 'm-misha',
    name: 'Миша',
    initials: 'Ми',
    role: 'child',
    avatarTint: 'peach',
    dueAmount: 0,
    paidAmount: 0,
    status: 'paid',
  },
  {
    id: 'm-polo',
    name: 'Поло',
    initials: 'По',
    role: 'pet',
    avatarTint: 'rose',
    dueAmount: 10710, // 107,10 BYN
    paidAmount: 0,
    status: 'unpaid',
  },
]

/** Сколько членов семьи нужно, чтобы вместо ростка показать цветок. */
export const STEM_TO_FLOWER_THRESHOLD = 5

const isoInDays = (n: number) => {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return d.toISOString()
}

export const charges: Charge[] = [
  {
    id: 'c-1',
    memberId: 'm-polo',
    title: 'Ветклиника',
    detail: 'Госпошлина за допуск к движению · ноябрь',
    amount: 10710,
    dueAt: isoInDays(17),
  },
  {
    id: 'c-2',
    memberId: 'm-anna',
    title: 'ЖКХ',
    detail: 'ул. Карла Маркса, 14 · ноябрь',
    amount: 0,
    dueAt: isoInDays(-3),
    label: 'sand',
  },
  {
    id: 'c-3',
    memberId: 'm-masha',
    title: 'Кружок «Робототехника»',
    detail: 'Центр «Юный техник» · ноябрь',
    amount: 0,
    dueAt: isoInDays(-2),
    label: 'peach',
  },
]

export const payments: Payment[] = [
  {
    id: 'p-1',
    payee: 'ЕРИП',
    title: 'ЖКХ · октябрь',
    amount: 16200,
    paidAt: isoInDays(-29),
    method: 'card',
    memberId: 'm-anna',
  },
  {
    id: 'p-2',
    payee: 'Садик № 15',
    title: 'Питание · октябрь',
    amount: 4300,
    paidAt: isoInDays(-30),
    method: 'erip',
    memberId: 'm-masha',
  },
]

export function memberById(id: string): FamilyMember | undefined {
  return family.find((m) => m.id === id)
}

/** Общая сумма к оплате по семье, копейки. */
export function totalDue(members: FamilyMember[] = family): number {
  return members.reduce((sum, m) => sum + Math.max(0, m.dueAmount - m.paidAmount), 0)
}

/** Форматирование копеек в «107,10 BYN». */
export function formatBYN(kopecks: number): string {
  const rub = kopecks / 100
  return `${rub.toLocaleString('ru-BY', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} BYN`
}

