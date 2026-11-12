import { useCallback } from 'react'
import { isIos } from '../lib/pwa/environment'
import { showLocalNotification } from '../lib/pwa/localNotifications'
import { setRemind } from '../lib/dalon/actions'
import { amountDue, keyDate } from '../lib/dalon/selectors'
import { formatDay } from '../lib/dates'
import { formatBYN } from '../lib/money'
import { showToast } from '../lib/toast'
import { useDalon } from './useDalon'
import { useNotifyPermission } from './useNotifyPermission'
import { useStandalone } from './useStandalone'

/**
 * Push-напоминания «Далони» (демо).
 * Разрешение спрашиваем только по кнопке. Текст уведомления не содержит ссылок на оплату:
 * по нажатию открывается сама «Далонь».
 */
export function usePushReminders() {
  const { permission, request } = useNotifyPermission()
  const standalone = useStandalone()
  const { state, charges, now } = useDalon()

  const enabled = state.remind.push && permission === 'granted'
  /** На iPhone уведомления есть только у приложения, добавленного на экран «Домой». */
  const iosNeedsInstall = isIos() && !standalone

  const enable = useCallback(async () => {
    const result = await request()
    if (result === 'granted') {
      setRemind('push', true)
      showToast({ tone: 'ok', message: 'Push-напоминания включены' })
    } else if (result === 'denied') {
      setRemind('push', false)
      showToast({ tone: 'warn', message: 'Уведомления запрещены в настройках браузера' })
    }
    return result
  }, [request])

  const disable = useCallback(() => {
    setRemind('push', false)
  }, [])

  const sendTest = useCallback(
    (delayMs = 0) => {
      const nearest = charges[0]
      const body = nearest
        ? `${nearest.title} — ${formatBYN(amountDue(nearest, now))} до ${formatDay(keyDate(nearest, now))}. Оплатить можно в приложении, ссылок на оплату мы не присылаем.`
        : 'Новых начислений нет. Мы напомним, когда они появятся.'
      const fire = async () => {
        const result = await showLocalNotification({
          title: 'Далонь: срок оплаты',
          body,
          tag: 'dalon-due',
          hash: '#/family',
        })
        if (result !== 'shown') {
          showToast({ tone: 'warn', message: 'Не удалось показать уведомление: нет разрешения' })
        }
      }
      if (delayMs > 0) {
        window.setTimeout(() => {
          void fire()
        }, delayMs)
        showToast({
          message: `Напоминание придёт через ${Math.round(delayMs / 1000)} секунд — можно свернуть приложение.`,
        })
      } else {
        void fire()
      }
    },
    [charges, now],
  )

  return { permission, enabled, iosNeedsInstall, enable, disable, sendTest }
}
