/** Даты и сроки: «15 ноября», «через 3 дня», «просрочено на 2 дня». */

const DAY = 86400000

export function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

export function addDays(d: Date, n: number): Date {
  const next = new Date(d)
  next.setDate(next.getDate() + n)
  return next
}

/** Полдень через n дней — чтобы смена часового пояса не сдвигала дату. */
export function isoInDays(n: number, from = new Date()): string {
  const d = addDays(startOfDay(from), n)
  d.setHours(12)
  return d.toISOString()
}

/** Сколько календарных дней до даты (отрицательное — уже прошла). */
export function daysUntil(iso: string, now = new Date()): number {
  return Math.round((startOfDay(new Date(iso)).getTime() - startOfDay(now).getTime()) / DAY)
}

export function plural(n: number, one: string, few: string, many: string): string {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) {
    return one
  }
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return few
  }
  return many
}

export function countText(n: number, one: string, few: string, many: string): string {
  return `${n} ${plural(n, one, few, many)}`
}

/** «15 ноября». */
export function formatDay(iso: string): string {
  return new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })
}

/** «15» и «нояб.» — для плашки с датой. */
export function formatDayParts(iso: string): { day: string; month: string } {
  const d = new Date(iso)
  return {
    day: String(d.getDate()),
    month: d.toLocaleDateString('ru-RU', { month: 'short' }).replace('.', ''),
  }
}

/** «Ноябрь 2026». */
export function formatMonth(d: Date): string {
  const s = d.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' }).replace(' г.', '')
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export function untilText(iso: string, now = new Date()): string {
  const n = daysUntil(iso, now)
  if (n < 0) {
    return `просрочено на ${countText(-n, 'день', 'дня', 'дней')}`
  }
  if (n === 0) {
    return 'сегодня'
  }
  if (n === 1) {
    return 'завтра'
  }
  return `через ${countText(n, 'день', 'дня', 'дней')}`
}

export type DueTone = 'overdue' | 'urgent' | 'soon' | 'calm'

/** Насколько срочно: просрочено / до 3 дней / до недели / спокойно. */
export function toneFor(iso: string, now = new Date()): DueTone {
  const n = daysUntil(iso, now)
  if (n < 0) {
    return 'overdue'
  }
  if (n <= 3) {
    return 'urgent'
  }
  if (n <= 7) {
    return 'soon'
  }
  return 'calm'
}

/** Цвет текста срока по срочности. */
export const toneText: Record<DueTone, string> = {
  overdue: 'text-bad',
  urgent: 'text-bad',
  soon: 'text-warn',
  calm: 'text-muted',
}
