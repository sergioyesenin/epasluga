import type {
  ChargeType,
  DalonAsset,
  DalonCharge,
  DalonDeadline,
  DalonPerson,
  DalonState,
  PaymentRecord,
  RemindSettings,
  ZagsRecord,
} from '../types/dalon'
import { isoInDays } from '../lib/dates'

/*
 * Демо-семья Ивановых. Суммы, сроки, имена и номера записей ЗАГС условные.
 * Состав семьи — по записям ЗАГС: брак Алексея и Анны, рождение Маши и Миши.
 * Polo, квартира и дача — имущество: у каждого свои начисления.
 */

export const ZAGS_DISTRICT = 'Отдел ЗАГС администрации Московского района г. Минска'

/** Адрес семьи из профиля — от него подбираются учреждения и пункты рядом. */
export const FAMILY_HOME = {
  city: 'minsk',
  text: 'г. Минск, ул. Карла Маркса, 14',
}

const MARRIAGE: ZagsRecord = {
  kind: 'marriage',
  number: '1287',
  date: '2010-08-21T12:00:00.000Z',
  office: 'Минский городской Дворец бракосочетания',
}

export const PEOPLE_SEED: DalonPerson[] = [
  {
    id: 'me',
    name: 'Алексей',
    full: 'Иванов Алексей Сергеевич',
    relation: 'Вы',
    kind: 'adult',
    initials: 'АС',
    birth: '1990-03-14T12:00:00.000Z',
    pays: true,
  },
  {
    id: 'anna',
    name: 'Анна',
    full: 'Иванова Анна Викторовна',
    relation: 'Супруга',
    kind: 'adult',
    initials: 'АВ',
    birth: '1991-07-08T12:00:00.000Z',
    basis: MARRIAGE,
    pays: true,
  },
  {
    id: 'masha',
    name: 'Маша',
    full: 'Иванова Мария Алексеевна',
    relation: 'Дочь',
    kind: 'child',
    initials: 'МА',
    birth: '2012-04-03T12:00:00.000Z',
    basis: {
      kind: 'birth',
      number: '902',
      date: '2012-04-12T12:00:00.000Z',
      office: ZAGS_DISTRICT,
    },
    pays: false,
    school: { name: 'Средняя школа № 151 г. Минска', grade: 9 },
  },
  {
    id: 'misha',
    name: 'Миша',
    full: 'Иванов Михаил Алексеевич',
    relation: 'Сын',
    kind: 'child',
    initials: 'МИ',
    birth: '2022-08-20T12:00:00.000Z',
    basis: {
      kind: 'birth',
      number: '1514',
      date: '2022-08-29T12:00:00.000Z',
      office: ZAGS_DISTRICT,
    },
    pays: false,
    kindergarten: 'Ясли-сад № 512 г. Минска',
  },
]

/** Демо-ребёнок для записи о рождении: с ним в семье 5 человек — растение становится цветком. */
export const NEWBORN_SEED: Omit<DalonPerson, 'birth' | 'basis'> = {
  id: 'alena',
  name: 'Алёна',
  full: 'Иванова Алёна Алексеевна',
  relation: 'Дочь',
  kind: 'child',
  initials: 'АА',
  pays: false,
}

export const ASSETS: DalonAsset[] = [
  {
    id: 'flat',
    kind: 'flat',
    name: 'Квартира',
    full: 'Квартира на ул. Карла Маркса, 14–27',
    detail: 'г. Минск, 64,2 м²',
    owners: 'собственники — вы и Анна',
    source: 'Налог и ЖКХ приходят по адресу квартиры сами.',
  },
  {
    id: 'car',
    kind: 'car',
    name: 'Polo',
    full: 'Volkswagen Polo',
    detail: '7714 AB-7',
    owners: 'владелец — вы',
    source: 'Штрафы с камер и госпошлина за техосмотр приходят по номеру автомобиля сами.',
  },
  {
    id: 'dacha',
    kind: 'dacha',
    name: 'Дача',
    full: 'Дача в СТ «Рассвет»',
    detail: 'Минский р-н, участок 0,08 га',
    owners: 'владелец — вы',
    source: 'Земельный налог приходит по кадастровому номеру участка сам.',
  },
]

/** Метка типа начисления: дети и учёба — персиковая, авто и штрафы — розоватая, остальное — песочная. */
export type LabelType = ChargeType | 'doc'

export const CHARGE_LABELS: Record<LabelType, { text: string; tone: 'peach' | 'rose' | 'sand' }> = {
  doc: { text: 'Документ', tone: 'sand' },
  kids: { text: 'Дети', tone: 'peach' },
  edu: { text: 'Учёба', tone: 'peach' },
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
    memberId: 'flat',
    type: 'tax',
    title: 'Налог на недвижимость за 2026 год',
    detail: 'Квартира: г. Минск, ул. Карла Маркса, 14–27',
    payee: 'Инспекция МНС по Московскому району г. Минска',
    amount: 18640,
    dueIn: 2,
  },
  {
    id: 'c-land',
    memberId: 'dacha',
    type: 'tax',
    title: 'Земельный налог за 2026 год',
    detail: 'Участок в СТ «Рассвет», Минский район',
    payee: 'Инспекция МНС по Минскому району',
    amount: 2350,
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
    id: 'c-net',
    memberId: 'anna',
    type: 'telecom',
    title: 'Домашний интернет и ТВ: ноябрь',
    detail: 'Договор на Анну № 1700-48213, тариф «Семейный»',
    payee: 'РУП «Белтелеком»',
    amount: 3290,
    dueIn: 9,
  },
  {
    id: 'c-home',
    memberId: 'flat',
    type: 'home',
    title: 'ЖКХ за октябрь',
    detail: 'Лицевой счёт: ул. Карла Маркса, 14–27',
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
    memberId: 'flat',
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
    people: PEOPLE_SEED.map((p) => ({ ...p })),
    assets: ASSETS.map((a) => ({ ...a })),
    charges: CHARGE_SEEDS.map(({ dueIn, discount, ...c }) => ({
      ...c,
      dueAt: isoInDays(dueIn, now),
      discount: discount
        ? { percent: discount.percent, until: isoInDays(discount.untilIn, now) }
        : undefined,
    })),
    deadlines: DEADLINE_SEEDS.map(({ dueIn, ...d }) => ({ ...d, dueAt: isoInDays(dueIn, now) })),
    history: HISTORY_SEEDS.map(({ ago, ...h }) => ({ ...h, paidAt: isoInDays(-ago, now) })),
    remind: { ...REMIND_DEFAULTS },
    log: [
      {
        id: 'l-1',
        at: isoInDays(-1, now),
        text: 'Состав семьи сверен с реестром ЗАГС: изменений нет',
        source: 'zags',
      },
      {
        id: 'l-2',
        at: isoInDays(-22, now),
        text: 'Вы оплатили: детский сад, питание за октябрь',
        source: 'you',
      },
      {
        id: 'l-3',
        at: isoInDays(-58, now),
        text: 'Анна включила себе «платит»: может оплачивать за семью',
        source: 'family',
      },
    ],
    career: [],
    testing: [],
    dismissed: [],
  }
}
