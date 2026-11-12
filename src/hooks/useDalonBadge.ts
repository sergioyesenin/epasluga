import { daysUntil } from '../lib/dates'
import { keyDate } from '../lib/dalon/selectors'
import { useDalon } from './useDalon'

/** Сколько начислений семьи нужно оплатить в ближайшую неделю (для значка в меню). */
export function useDalonBadge(): number {
  const { charges, now } = useDalon()
  return charges.filter((c) => daysUntil(keyDate(c, now), now) <= 7).length
}
