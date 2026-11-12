/**
 * Демо push-напоминаний: локальные уведомления через service worker.
 * Настоящий push требует сервера (Web Push + VAPID); здесь уведомление
 * создаёт само приложение, но выглядит и открывается так же.
 */

export type NotifyPermission = NotificationPermission | 'unsupported'

export type LocalNotice = {
  title: string
  body: string
  /** Одинаковый tag заменяет прошлое уведомление, а не копит их. */
  tag: string
  /** Какой раздел открыть по клику, например '#/family'. */
  hash: string
}

export function notificationsSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window
}

export function getNotifyPermission(): NotifyPermission {
  if (!notificationsSupported()) {
    return 'unsupported'
  }
  return Notification.permission
}

/** Запрос разрешения — только по нажатию пользователя, не при загрузке. */
export async function requestNotifyPermission(): Promise<NotifyPermission> {
  if (!notificationsSupported()) {
    return 'unsupported'
  }
  if (Notification.permission !== 'default') {
    return Notification.permission
  }
  return Notification.requestPermission()
}

export async function showLocalNotification(
  notice: LocalNotice,
): Promise<'shown' | 'denied' | 'unsupported'> {
  const permission = getNotifyPermission()
  if (permission === 'unsupported') {
    return 'unsupported'
  }
  if (permission !== 'granted') {
    return 'denied'
  }

  const options: NotificationOptions = {
    body: notice.body,
    tag: notice.tag,
    icon: './icons/icon-192.png',
    badge: './icons/maskable-192.png',
    lang: 'ru',
    data: { hash: notice.hash },
  }

  const registration =
    'serviceWorker' in navigator ? await navigator.serviceWorker.getRegistration() : undefined

  if (registration) {
    // В установленном приложении (и на Android вообще) работает только этот путь
    await registration.showNotification(notice.title, options)
    return 'shown'
  }

  // Без service worker (npm run dev) — обычное уведомление страницы
  const n = new Notification(notice.title, options)
  n.onclick = () => {
    window.focus()
    window.location.hash = notice.hash
    n.close()
  }
  return 'shown'
}
