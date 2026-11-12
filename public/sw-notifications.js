/*
 * Подключается в service worker через workbox.importScripts (см. vite.config.ts).
 * Клик по уведомлению: открыть раздел из notification.data.hash
 * в уже открытом окне приложения или в новом.
 */
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const hash = (event.notification.data && event.notification.data.hash) || '#/'
  const target = new URL('./' + hash, self.registration.scope).href

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windows) => {
      const opened = windows.find((w) => w.url.startsWith(self.registration.scope))
      if (opened) {
        opened.postMessage({ type: 'open-hash', hash: hash })
        return opened.focus()
      }
      return self.clients.openWindow(target)
    }),
  )
})
