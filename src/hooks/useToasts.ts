import { useSyncExternalStore } from 'react'
import { getToasts, subscribeToasts } from '../lib/toast'

/** Текущие всплывающие сообщения (для отрисовки в Toaster). */
export function useToasts() {
  return useSyncExternalStore(subscribeToasts, getToasts, getToasts)
}
