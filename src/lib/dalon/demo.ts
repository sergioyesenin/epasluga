import { removeApplications } from '../applications'
import { resetDalon } from './store'

/** Заявления, которые создаёт «Далонь» (регистрация на РТ / ЦТ / ЦЭ). */
export const DALON_APP_PREFIX = 'a-dalon-'

/** Начать демо «Далони» заново: семья, начисления, предложения и созданные заявления. */
export function resetDalonDemo() {
  resetDalon()
  removeApplications((a) => a.id.startsWith(DALON_APP_PREFIX))
  try {
    sessionStorage.removeItem('epasluga-dalon-selection')
  } catch {
    // без sessionStorage выбор и так не сохраняется
  }
}
