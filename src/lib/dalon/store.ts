import type { DalonState } from '../../types/dalon'
import { createSeedState } from '../../data/dalon'

/**
 * Хранилище «Далони» в localStorage.
 * Один экземпляр на приложение: панель, главная и сайдбар видят одни и те же данные.
 * Подписка — через useSyncExternalStore (см. hooks/useDalon.ts).
 */

const KEY = 'epasluga-dalon'
const VERSION = 1

type Listener = () => void

let state: DalonState | null = null
const listeners = new Set<Listener>()

function read(): DalonState {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || 'null') as DalonState | null
    if (raw && raw.v === VERSION) {
      return raw
    }
  } catch {
    // повреждённые данные — засеваем заново
  }
  const seeded = createSeedState(VERSION)
  write(seeded)
  return seeded
}

function write(next: DalonState) {
  try {
    localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    // нет места или приватный режим — данные останутся до перезагрузки
  }
}

function emit() {
  listeners.forEach((l) => {
    l()
  })
}

export function getDalonState(): DalonState {
  if (!state) {
    state = read()
  }
  return state
}

export function subscribeDalon(listener: Listener) {
  listeners.add(listener)
  if (listeners.size === 1) {
    window.addEventListener('storage', onStorage)
  }
  return () => {
    listeners.delete(listener)
    if (listeners.size === 0) {
      window.removeEventListener('storage', onStorage)
    }
  }
}

/** Изменения из другой вкладки. */
function onStorage(e: StorageEvent) {
  if (e.key === KEY) {
    state = read()
    emit()
  }
}

/** Неизменяемое обновление: fn получает текущее состояние и возвращает новое. */
export function updateDalon(fn: (prev: DalonState) => DalonState) {
  state = fn(getDalonState())
  write(state)
  emit()
}

/** Вернуть демо-данные к началу (кнопка в «Истории»). */
export function resetDalon() {
  state = createSeedState(VERSION)
  write(state)
  emit()
}
