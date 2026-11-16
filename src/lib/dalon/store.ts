import type { DalonState } from '../../types/dalon'
import { createSeedState } from '../../data/dalon'
import { isRecord, readJson, writeJson } from '../storage'

/**
 * Хранилище «Далони» в localStorage.
 * Один экземпляр на приложение: панель, главная и сайдбар видят одни и те же данные.
 * Подписка — через useSyncExternalStore (см. hooks/useDalon.ts).
 */

const KEY = 'epasluga-dalon'
// 2 — состав семьи по записям ЗАГС, имущество, профориентация и тестирование
const VERSION = 2

type Listener = () => void

let state: DalonState | null = null
const listeners = new Set<Listener>()

const LIST_FIELDS = [
  'people',
  'assets',
  'charges',
  'deadlines',
  'history',
  'log',
  'career',
  'testing',
  'dismissed',
] as const

/**
 * Проверка формы, а не только номера версии: «Далонь» читает каркас приложения
 * (бейдж в меню), и обрезанный объект с верной версией ронял бы весь интерфейс.
 */
function isDalonState(value: unknown): value is DalonState {
  return (
    isRecord(value) &&
    value.v === VERSION &&
    isRecord(value.remind) &&
    LIST_FIELDS.every((field) => Array.isArray(value[field]))
  )
}

function read(): DalonState {
  const stored = readJson<DalonState | null>(KEY, null, isDalonState)
  if (stored) {
    return stored
  }
  // Первый запуск, старая версия или повреждённые данные — засеваем заново
  const seeded = createSeedState(VERSION)
  write(seeded)
  return seeded
}

function write(next: DalonState) {
  // Нет места или приватный режим — данные останутся до перезагрузки
  writeJson(KEY, next)
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

/** Вернуть демо-данные к началу (кнопки в «Истории» и в демо-блоке ЗАГС). */
export function resetDalon() {
  state = createSeedState(VERSION)
  write(state)
  emit()
}
