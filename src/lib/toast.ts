/**
 * Маленькое хранилище всплывающих сообщений.
 * Без контекста: показать сообщение можно из любого места —
 * из компонента, хука или колбэка service worker'а.
 */

export type ToastTone = 'info' | 'ok' | 'warn'

export type ToastAction = {
  label: string
  onClick: () => void
}

export type ToastItem = {
  id: string
  message: string
  title?: string
  tone: ToastTone
  action?: ToastAction
  /** Через сколько миллисекунд скрыть. null — пока пользователь не закроет. */
  duration: number | null
}

type ShowOptions = Partial<Omit<ToastItem, 'message'>> & { message: string }

type Listener = () => void

const DEFAULT_DURATION = 4500

let items: ToastItem[] = []
const listeners = new Set<Listener>()
const timers = new Map<string, number>()

function emit() {
  listeners.forEach((l) => {
    l()
  })
}

export function subscribeToasts(listener: Listener) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function getToasts() {
  return items
}

export function dismissToast(id: string) {
  const timer = timers.get(id)
  if (timer) {
    window.clearTimeout(timer)
    timers.delete(id)
  }
  items = items.filter((t) => t.id !== id)
  emit()
}

export function showToast(options: ShowOptions | string): string {
  const opts = typeof options === 'string' ? { message: options } : options
  const id = opts.id ?? `t-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
  const item: ToastItem = {
    id,
    message: opts.message,
    title: opts.title,
    tone: opts.tone ?? 'info',
    action: opts.action,
    duration: opts.duration === undefined ? DEFAULT_DURATION : opts.duration,
  }
  // Повторный показ с тем же id заменяет сообщение, а не дублирует его
  items = [...items.filter((t) => t.id !== id), item].slice(-3)
  emit()

  const old = timers.get(id)
  if (old) {
    window.clearTimeout(old)
  }
  if (item.duration !== null) {
    timers.set(
      id,
      window.setTimeout(() => {
        dismissToast(id)
      }, item.duration),
    )
  }
  return id
}
