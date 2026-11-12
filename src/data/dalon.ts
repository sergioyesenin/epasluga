import type {
  ChargeType,
  DalonCharge,
  DalonDeadline,
  DalonMember,
  DalonPerson,
  DalonState,
  PaymentRecord,
  RemindSettings,
} from '../types/dalon'
import { isoInDays } from '../lib/dates'

/*
 * Демо-семья Ивановых. Суммы, сроки и имена условные.
 * Polo — автомобиль (не питомец): на него приходят госпошлина
 * за техосмотр и штрафы с камер.
 */

export const DALON_MEMBERS: DalonMember[] = [
  {
    id: 'me',
    name: 'Алексей',
    full: 'Иванов Алексей Сергеевич',
    role: 'Вы',
    kind: 'adult',
    initials: 'АС',
    finger: 'thumb',
  },
  {
    id: 'anna',
    name: 'Анна',
    full: 'Иванова Анна Викторовна',
    role: 'Супруга',
    kind: 'adult',
    initials: 'АВ',
    finger: 'index',
  },
  {
    id: 'masha',
    name: 'Маша',
    full: 'Иванова Мария Алексеевна',
    role: 'Дочь, 9 лет',
    kind: 'child',
    initials: 'МА',
    finger: 'middle',
  },
  {
    id: 'misha',
    name: 'Миша',
    full: 'Иванов Михаил Алексеевич',
    role: 'Сын, 4 года',
    kind: 'child',
    initials: 'МИ',
    finger: 'ring',
  },
  {
    id: 'car',
    name: 'Polo',
    full: 'Volkswagen Polo',
    role: '7714 AB-7, владелец — вы',
    kind: 'car',
    initials: '',
    finger: 'pinky',
  },
]

export function memberById(id: string): DalonMember | undefined {
  return DALON_MEMBERS.find((m) => m.id === id)
}

/** Метка типа начисления: дети — персиковая, авто и штрафы — розоватая, остальное — песочная. */
export const CHARGE_LABELS: Record<ChargeType, { text: string; tone: 'peach' | 'rose' | 'sand' }> = {
  kids: { text: 'Дети', tone: 'peach' },
  fine: { text: 'Штраф ГАИ', tone: 'rose' },
  car: { text: 'Авто', tone: 'rose' },
  tax: { text: 'Налог', tone: 'sand' },
  home: { text: 'ЖКХ', tone: 'sand' },
  telecom: { text: 'Связь', tone: 'sand' },
}

type ChargeSeed = Omit<DalonCharge, 'dueAt' | 'discount'> & {
  dueIn: number
  discount?: { percent: number; untilIn: number }
}

const CHARGE_SEEDS: ChargeSeed[] = [
  {
    id: 'c-tax',
    memberId: 'me',
    type: 'tax',
    title: 'Налог на недвижимость за 2026 год',
    detail: 'Квартира: г. Минск, ул. Карла Маркса, 14–27',
    payee: 'Инспекция МНС по Московскому району г. Минска',
    amount: 18640,
    dueIn: 2,
  },
  {
    id: 'c-fine',
    memberId: 'car',
    type: 'fine',
    title: 'Превышение скорости на 22 км/ч',
    detail: 'Камера на пр. Победителей, 2 ноября, 14:37',
    payee: 'УГАИ ГУВД Мингорисполкома',
    amount: 8400,
    dueIn: 30,
    discount: { percent: 50, untilIn: 6 },
  },
  {
    id: 'c-kg',
    memberId: 'misha',
    type: 'kids',
    title: 'Детский сад: питание за ноябрь',
    detail: 'Ясли-сад № 512, группа «Солнышко»',
    payee: 'ГУО «Ясли-сад № 512 г. Минска»',
    amount: 4530,
    dueIn: 7,
  },
  {
    id: 'c-home',
    memberId: 'anna',
    type: 'home',
    title: 'ЖКХ за октябрь',
    detail: 'Лицевой счёт на Анну: ул. Карла Маркса, 14–27',
    payee: 'КУП «ЖРЭО Московского района г. Минска»',
    amount: 11864,
    dueIn: 12,
  },
  {
    id: 'c-club',
    memberId: 'masha',
    type: 'kids',
    title: 'Кружок робототехники: ноябрь',
    detail: 'Дворец детского творчества, 8 занятий',
    payee: 'Дворец детского творчества Московского района',
    amount: 3800,
    dueIn: 13,
  },
  {
    id: 'c-net',
    memberId: 'me',
    type: 'telecom',
    title: 'Домашний интернет и ТВ: ноябрь',
    detail: 'Договор № 1700-48213, тариф «Семейный»',
    payee: 'РУП «Белтелеком»',
    amount: 3290,
    dueIn: 17,
  },
  {
    id: 'c-to',
    memberId: 'car',
    type: 'car',
    title: 'Техосмотр: госпошлина за допуск к движению',
    detail: 'Оплатите до диагностики — станция техосмотра увидит оплату сама',
    payee: 'Госпошлина через ЕРИП',
    amount: 10710,
    dueIn: 18,
  },
]

type DeadlineSeed = Omit<DalonDeadline, 'dueAt'> & { dueIn: number }

const DEADLINE_SEEDS: DeadlineSeed[] = [
  {
    id: 'd-to',
    memberId: 'car',
    type: 'car',
    title: 'Пройти техосмотр Polo',
    detail: 'Разрешение на допуск к движению заканчивается. Запишитесь на диагностику заранее.',
    dueIn: 18,
    href: '/service/200-15-17',
    action: 'Об услуге',
  },
  {
    id: 'd-pass',
    memberId: 'anna',
    type: 'doc',
    title: 'Паспорт Анны заканчивается',
    detail: 'Подайте на замену за 2 месяца до конца срока, чтобы не остаться без документа.',
    dueIn: 121,
    href: '/service/200-12-1',
    action: 'Об услуге',
  },
]

type HistorySeed = Omit<PaymentRecord, 'paidAt'> & { ago: number }

const HISTORY_SEEDS: HistorySeed[] = [
  {
    id: 'h1',
    title: 'Детский сад: питание за октябрь',
    memberId: 'misha',
    type: 'kids',
    payee: 'ГУО «Ясли-сад № 512 г. Минска»',
    amount: 4490,
    ago: 22,
    method: 'erip',
    receipt: 'ЕР-26104821',
  },
  {
    id: 'h2',
    title: 'Кружок робототехники: октябрь',
    memberId: 'masha',
    type: 'kids',
    payee: 'Дворец детского творчества Московского района',
    amount: 3800,
    ago: 25,
    method: 'erip',
    receipt: 'ЕР-26102267',
  },
  {
    id: 'h3',
    title: 'ЖКХ за сентябрь',
    memberId: 'anna',
    type: 'home',
    payee: 'КУП «ЖРЭО Московского района г. Минска»',
    amount: 9712,
    ago: 34,
    method: 'card',
    receipt: 'БК-26097455',
  },
  {
    id: 'h4',
    title: 'Штраф ГАИ: парковка (скидка 50 %)',
    memberId: 'car',
    type: 'fine',
    payee: 'УГАИ ГУВД Мингорисполкома',
    amount: 2100,
    ago: 48,
    method: 'card',
    receipt: 'БК-26095310',
  },
  {
    id: 'h5',
    title: 'Детский сад: питание за сентябрь',
    memberId: 'misha',
    type: 'kids',
    payee: 'ГУО «Ясли-сад № 512 г. Минска»',
    amount: 4320,
    ago: 53,
    method: 'erip',
    receipt: 'ЕР-26091744',
  },
]

const PEOPLE_SEEDS: Array<Omit<DalonPerson, 'consentAt'> & { ago: number }> = [
  {
    id: 'p-anna',
    name: 'Анна',
    full: 'Иванова Анна Викторовна',
    relation: 'Супруга',
    consent: 'given',
    ago: 58,
    sees: true,
    pays: true,
    memberId: 'anna',
  },
  {
    id: 'p-dad',
    name: 'Сергей Петрович',
    full: 'Иванов Сергей Петрович',
    relation: 'Отец',
    consent: 'pending',
    ago: 1,
    sees: true,
    pays: false,
  },
]

export const REMIND_DEFAULTS: RemindSettings = {
  d7: true,
  d1: true,
  d0: false,
  push: false,
  sms: false,
  email: true,
  tax: true,
  fine: true,
  kids: true,
  home: true,
  doc: true,
}

/** Начальное состояние: относительные сроки превращаются в даты от «сегодня». */
export function createSeedState(version: number, now = new Date()): DalonState {
  return {
    v: version,
    charges: CHARGE_SEEDS.map(({ dueIn, discount, ...c }) => ({
      ...c,
      dueAt: isoInDays(dueIn, now),
      discount: discount
        ? { percent: discount.percent, until: isoInDays(discount.untilIn, now) }
        : undefined,
    })),
    deadlines: DEADLINE_SEEDS.map(({ dueIn, ...d }) => ({ ...d, dueAt: isoInDays(dueIn, now) })),
    history: HISTORY_SEEDS.map(({ ago, ...h }) => ({ ...h, paidAt: isoInDays(-ago, now) })),
    people: PEOPLE_SEEDS.map(({ ago, ...p }) => ({ ...p, consentAt: isoInDays(-ago, now) })),
    remind: { ...REMIND_DEFAULTS },
    log: [
      {
        id: 'l-1',
        at: isoInDays(-1, now),
        text: 'Вы отправили запрос на доступ: Сергей Петрович (отец)',
      },
      {
        id: 'l-2',
        at: isoInDays(-22, now),
        text: 'Вы оплатили: детский сад, питание за октябрь',
      },
      {
        id: 'l-3',
        at: isoInDays(-58, now),
        text: 'Анна дала согласие: видит и платит',
      },
    ],
  }
}
