import { useSyncExternalStore } from 'react'

function subscribe(onChange: () => void) {
  window.addEventListener('online', onChange)
  window.addEventListener('offline', onChange)
  return () => {
    window.removeEventListener('online', onChange)
    window.removeEventListener('offline', onChange)
  }
}

function getSnapshot() {
  return navigator.onLine
}

/** true — сеть есть. Браузер узнаёт о пропаже сети с задержкой в пару секунд. */
export function useOnlineStatus() {
  return useSyncExternalStore(subscribe, getSnapshot, () => true)
}
