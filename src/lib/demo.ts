import { showToast } from './toast'

/** Действие, которого нет в прототипе: всплывающее сообщение вместо блокирующего alert(). */
export function demoUnavailable(message: string) {
  showToast({
    id: 'demo-unavailable',
    tone: 'info',
    title: 'Демо-прототип',
    message: `${message}.`,
  })
}
