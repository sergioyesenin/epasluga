import { registerSW } from 'virtual:pwa-register'
import { showToast } from '../toast'

const UPDATE_CHECK_MS = 60 * 60 * 1000

/**
 * Регистрация service worker (Workbox, генерирует vite-plugin-pwa).
 * В режиме разработки модуль-заглушка ничего не делает — SW работает
 * только в сборке: npm run build && npm run preview.
 */
export function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) {
    return
  }

  const updateSW = registerSW({
    immediate: true,
    onNeedRefresh() {
      showToast({
        id: 'sw-update',
        title: 'Доступна новая версия',
        message: 'Займёт пару секунд, данные сохранятся.',
        action: {
          label: 'Обновить',
          onClick: () => {
            void updateSW(true)
          },
        },
        duration: null,
      })
    },
    onOfflineReady() {
      showToast({
        id: 'sw-offline',
        tone: 'ok',
        message: 'Приложение сохранено на устройстве — теперь оно открывается и без сети.',
      })
    },
    onRegisteredSW(_url, registration) {
      if (!registration) {
        return
      }
      // Установленное приложение может неделями не перезагружаться — проверяем обновления сами
      window.setInterval(() => {
        if (navigator.onLine) {
          registration.update().catch(() => {
            // сеть пропала между проверкой и запросом — попробуем в следующий раз
          })
        }
      }, UPDATE_CHECK_MS)
    },
  })

  // Клик по уведомлению при открытом приложении: SW присылает, какой раздел открыть
  navigator.serviceWorker.addEventListener('message', (event: MessageEvent) => {
    const data = event.data as { type?: string; hash?: string } | null
    if (data?.type === 'open-hash' && data.hash) {
      window.location.hash = data.hash
    }
  })
}
