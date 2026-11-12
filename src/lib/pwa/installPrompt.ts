/**
 * Перехват beforeinstallprompt (Chrome, Edge, Samsung Internet на Android и компьютере).
 * Событие может прийти раньше, чем смонтируется React, поэтому слушатель
 * вешается при импорте модуля — он подключается в main.tsx до рендера.
 */

type Listener = () => void

export type InstallSnapshot = {
  /** Можно показать системное окно установки. */
  canPrompt: boolean
  /** Пользователь установил приложение в этой сессии. */
  installed: boolean
}

let deferred: BeforeInstallPromptEvent | null = null
let snapshot: InstallSnapshot = { canPrompt: false, installed: false }
const listeners = new Set<Listener>()

function set(next: Partial<InstallSnapshot>) {
  snapshot = { ...snapshot, ...next }
  listeners.forEach((l) => {
    l()
  })
}

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (event) => {
    // Свой баннер вместо мини-панели браузера
    event.preventDefault()
    deferred = event
    set({ canPrompt: true })
  })
  window.addEventListener('appinstalled', () => {
    deferred = null
    set({ canPrompt: false, installed: true })
  })
}

export function subscribeInstall(listener: Listener) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function getInstallSnapshot() {
  return snapshot
}

/** Показать системное окно установки. */
export async function promptInstall(): Promise<'accepted' | 'dismissed' | 'unavailable'> {
  if (!deferred) {
    return 'unavailable'
  }
  const event = deferred
  // Событие одноразовое: второй раз prompt() вызвать нельзя
  deferred = null
  set({ canPrompt: false })
  await event.prompt()
  const { outcome } = await event.userChoice
  return outcome
}
