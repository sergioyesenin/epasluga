import type { Service } from '../types/service'
import { services as baseServices } from './services'
import { servicesExtra } from './servicesExtra'

/**
 * Единый каталог услуг: сгенерированные услуги + услуги Волн 1–2 из servicesExtra.
 * Все экраны ищут услугу здесь. Раньше карточка услуги, статус и «Мои услуги» искали
 * только в services.ts — и услуги из жизненных ситуаций открывались как «не найдена».
 */
export const allServices: Service[] = [...baseServices, ...servicesExtra]

const byId = new Map(allServices.map((s) => [s.id, s]))

export function serviceById(id: string | undefined): Service | undefined {
  if (!id) {
    return undefined
  }
  return byId.get(id)
}
