import { useEffect, useRef } from 'react'
import { Icon } from '../../design-system'
import { useOnlineStatus } from '../../hooks/useOnlineStatus'
import { dismissToast, showToast } from '../../lib/toast'

/**
 * Полоса «Нет сети» под шапкой. Объясняет, что работает без интернета:
 * всё, что уже на устройстве, открывается; отправка и оплата ждут сеть.
 */
export function OfflineBanner() {
  const online = useOnlineStatus()
  const wasOnline = useRef(online)

  useEffect(() => {
    if (wasOnline.current === online) {
      return
    }
    wasOnline.current = online
    if (online) {
      dismissToast('net-off')
      showToast({
        id: 'net-on',
        tone: 'ok',
        message: 'Сеть снова есть. Можно отправлять заявления и платить.',
      })
    }
  }, [online])

  if (online) {
    return null
  }

  return (
    <div
      role="status"
      className="sticky top-[calc(3.5rem+env(safe-area-inset-top))] md:top-16 z-20 bg-warn-tint border-b border-warn-line text-warn"
    >
      <div className="px-4 md:px-8 py-2.5 flex items-start gap-2.5 text-sm max-w-6xl">
        <Icon name="offline" className="w-5 h-5 shrink-0 mt-px" />
        <p>
          <span className="font-semibold">Нет сети.</span> Каталог, жизненные ситуации, документы и
          «Далонь» открываются из памяти телефона. Отправка заявлений и оплата заработают, когда
          появится интернет.
        </p>
      </div>
    </div>
  )
}
