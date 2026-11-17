import type { TestingKind } from '../types/dalon'

/*
 * Регистрация на РТ / ЦТ / ЦЭ внутри Е-Паслуги. Сейчас она идёт на сайте РИКЗ (rikc.by).
 * Правила, даты, цены и пункты на 2026/2027 учебный год неизвестны —
 * всё ниже ДЕМО и подписано «уточнить в РИКЗ».
 */

export const TESTING_DISCLAIMER =
  'Демо: правила, даты, цены и пункты условные — уточните на сайте РИКЗ (rikc.by).'

export const RIKZ = 'Республиканский институт контроля знаний (РИКЗ)'

export interface TestingKindInfo {
  id: TestingKind
  short: string
  title: string
  text: string
  /** Демо-стоимость одного предмета в копейках; 0 — без оплаты. */
  pricePerSubject: number
}

export const TESTING_KINDS: Record<TestingKind, TestingKindInfo> = {
  rt: {
    id: 'rt',
    short: 'РТ',
    title: 'Репетиционное тестирование',
    text: 'Тренировка в настоящих условиях: бланки, время, пункт. Проходит в несколько этапов в течение учебного года. В зачёт при поступлении не идёт.',
    pricePerSubject: 1600,
  },
  ct: {
    id: 'ct',
    short: 'ЦТ',
    title: 'Централизованное тестирование',
    text: 'Вступительное испытание: результат засчитывается при поступлении в вуз и колледж. Как правило, его сдают по предметам, которых нет в ЦЭ, и выпускники прошлых лет.',
    pricePerSubject: 1800,
  },
  ce: {
    id: 'ce',
    short: 'ЦЭ',
    title: 'Централизованный экзамен',
    text: 'С 2023 года выпускники 11 класса сдают ЦЭ: он засчитывается и как выпускной экзамен в школе, и при поступлении. Порядок регистрации на этот год уточните в школе и РИКЗ.',
    pricePerSubject: 0,
  },
}

export const TESTING_SUBJECTS = [
  'Русский язык',
  'Белорусский язык',
  'Математика',
  'Физика',
  'Химия',
  'Биология',
  'История Беларуси',
  'Обществоведение',
  'Всемирная история',
  'География',
  'Английский язык',
  'Немецкий язык',
  'Китайский язык',
]

/** Демо-ограничение: сколько предметов можно выбрать за одну регистрацию. */
export const MAX_SUBJECTS = 4

export interface TestingSession {
  id: string
  label: string
  /** Дата (ISO). */
  date: string
}

function nextSaturday(from: Date, weeksAhead: number): Date {
  const d = new Date(from.getFullYear(), from.getMonth(), from.getDate(), 12)
  const add = (6 - d.getDay() + 7) % 7 || 7
  d.setDate(d.getDate() + add + weeksAhead * 7)
  return d
}

/** Демо-даты: РТ — ближайшие субботы, ЦТ и ЦЭ — летом следующего года. */
export function testingSessions(kind: TestingKind, now = new Date()): TestingSession[] {
  if (kind === 'rt') {
    return [
      { id: 'rt-2', label: 'Этап 2', date: nextSaturday(now, 3).toISOString() },
      { id: 'rt-3', label: 'Этап 3', date: nextSaturday(now, 11).toISOString() },
    ]
  }
  const year = now.getMonth() >= 6 ? now.getFullYear() + 1 : now.getFullYear()
  const at = (m: number, d: number) => new Date(year, m, d, 12).toISOString()
  if (kind === 'ce') {
    return [
      { id: 'ce-1', label: 'Основной срок', date: at(5, 2) },
      { id: 'ce-2', label: 'Резервный день', date: at(5, 9) },
    ]
  }
  return [
    { id: 'ct-1', label: 'Основной этап', date: at(5, 16) },
    { id: 'ct-2', label: 'Резервный день', date: at(6, 2) },
  ]
}

/** Демо-пункты тестирования по городам. */
export const TESTING_POINTS: Record<string, string[]> = {
  minsk: [
    'Пункт № 4 — Московский р-н, рядом с домом',
    'Пункт № 1 — Ленинский р-н',
    'Пункт № 7 — Фрунзенский р-н',
  ],
  grodno: ['Пункт № 1 — центр города', 'Пункт № 2 — микрорайон Девятовка'],
  brest: ['Пункт № 1 — центр города', 'Пункт № 2 — Восток'],
  gomel: ['Пункт № 1 — Центральный р-н', 'Пункт № 2 — Советский р-н'],
  vitebsk: ['Пункт № 1 — Первомайский р-н', 'Пункт № 2 — Октябрьский р-н'],
  mogilev: ['Пункт № 1 — Ленинский р-н', 'Пункт № 2 — Октябрьский р-н'],
}
