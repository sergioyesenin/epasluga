import { useSyncExternalStore } from 'react'
import { isStandalone, subscribeDisplayMode } from '../lib/pwa/environment'

/** Запущено как установленное приложение (с экрана «Домой» или из меню приложений). */
export function useStandalone() {
  return useSyncExternalStore(subscribeDisplayMode, isStandalone, () => false)
}
