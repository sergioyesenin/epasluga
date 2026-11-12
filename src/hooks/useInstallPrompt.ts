import { useCallback, useState, useSyncExternalStore } from 'react'
import { isIos } from '../lib/pwa/environment'
import { getInstallSnapshot, promptInstall, subscribeInstall } from '../lib/pwa/installPrompt'
import { useStandalone } from './useStandalone'

const DISMISS_KEY = 'epasluga-install-dismissed'
const DISMISS_DAYS = 14

function readDismissed(): boolean {
  try {
    const at = Number(localStorage.getItem(DISMISS_KEY) || 0)
    return Date.now() - at < DISMISS_DAYS * 86400000
  } catch {
    return false
  }
}

export type InstallMode =
  /** Системное окно установки (Chrome, Edge, Samsung Internet). */
  | 'prompt'
  /** iPhone/iPad: только вручную через «Поделиться». */
  | 'ios'
  /** Уже установлено, закрыто пользователем или браузер не умеет. */
  | 'none'

/** Состояние баннера «Установить приложение». */
export function useInstallPrompt() {
  const standalone = useStandalone()
  const { canPrompt, installed } = useSyncExternalStore(
    subscribeInstall,
    getInstallSnapshot,
    getInstallSnapshot,
  )
  const [dismissed, setDismissed] = useState(readDismissed)

  let mode: InstallMode = 'none'
  if (!standalone && !installed && !dismissed) {
    if (canPrompt) {
      mode = 'prompt'
    } else if (isIos()) {
      mode = 'ios'
    }
  }

  const dismiss = useCallback(() => {
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()))
    } catch {
      // приватный режим — просто скрываем до перезагрузки
    }
    setDismissed(true)
  }, [])

  return { mode, installed, install: promptInstall, dismiss }
}
