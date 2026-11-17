import { useCallback, useState, useSyncExternalStore } from 'react'
import { isIos } from '../lib/pwa/environment'
import { getInstallSnapshot, promptInstall, subscribeInstall } from '../lib/pwa/installPrompt'
import { useStandalone } from './useStandalone'
import { readString, writeString } from '../lib/storage'

const DISMISS_KEY = 'epasluga-install-dismissed'
const DISMISS_DAYS = 14

function readDismissed(): boolean {
  const at = Number(readString(DISMISS_KEY) || 0)
  return Date.now() - at < DISMISS_DAYS * 86400000
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
    // приватный режим — запись не удастся, баннер просто скроется до перезагрузки
    writeString(DISMISS_KEY, String(Date.now()))
    setDismissed(true)
  }, [])

  return { mode, installed, install: promptInstall, dismiss }
}
