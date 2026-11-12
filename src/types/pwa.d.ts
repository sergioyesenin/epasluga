/** Событие Chrome/Android перед показом системного окна установки. */
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
  prompt(): Promise<void>
}

interface WindowEventMap {
  beforeinstallprompt: BeforeInstallPromptEvent
}

interface Navigator {
  /** Safari на iOS: true, если открыто с экрана «Домой». */
  readonly standalone?: boolean
}
