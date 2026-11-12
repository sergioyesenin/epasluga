/** Где и как запущено приложение. */

const STANDALONE_QUERY = '(display-mode: standalone)'

export function isStandalone(): boolean {
  if (typeof window === 'undefined') {
    return false
  }
  return window.matchMedia(STANDALONE_QUERY).matches || window.navigator.standalone === true
}

/** Подписка на смену режима (например, после установки в Chrome на компьютере). */
export function subscribeDisplayMode(onChange: () => void) {
  const mq = window.matchMedia(STANDALONE_QUERY)
  mq.addEventListener('change', onChange)
  return () => {
    mq.removeEventListener('change', onChange)
  }
}

/** iPhone и iPad (iPadOS притворяется Mac, но у него есть тач). */
export function isIos(): boolean {
  if (typeof navigator === 'undefined') {
    return false
  }
  const ua = navigator.userAgent
  return /iphone|ipad|ipod/i.test(ua) || (/macintosh/i.test(ua) && navigator.maxTouchPoints > 1)
}
