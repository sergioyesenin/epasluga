/**
 * Безопасная работа с localStorage.
 *
 * localStorage может бросить исключение (запрещён в настройках браузера, приватный режим
 * Safari, переполнен), а в нём может лежать что угодно: битый JSON, данные старой версии
 * прототипа, ручные правки в DevTools. Поэтому:
 *  - чтение и запись никогда не бросают — при ошибке возвращается запасное значение;
 *  - прочитанное проверяется guard-функцией, неподходящее отбрасывается;
 *  - при смене формата данных SCHEMA_VERSION поднимается, и все ключи прототипа сбрасываются.
 */

/** Все ключи прототипа начинаются с этого префикса. */
const APP_PREFIX = 'epasluga-'
const SCHEMA_KEY = 'epasluga-schema'
/** Поднять при несовместимом изменении формата любых сохранённых данных. */
const SCHEMA_VERSION = 1

function local(): Storage | null {
  try {
    return window.localStorage
  } catch {
    return null
  }
}

function session(): Storage | null {
  try {
    return window.sessionStorage
  } catch {
    return null
  }
}

export function readString(key: string): string | null {
  try {
    return local()?.getItem(key) ?? null
  } catch {
    return null
  }
}

export function writeString(key: string, value: string): boolean {
  try {
    local()?.setItem(key, value)
    return true
  } catch {
    // нет места или хранилище запрещено — данные проживут до перезагрузки
    return false
  }
}

export function removeKey(key: string) {
  try {
    local()?.removeItem(key)
  } catch {
    // нечего удалять, если хранилище недоступно
  }
}

/** Прочитать JSON и проверить форму. Битое или чужое значение → fallback. */
export function readJson<T>(key: string, fallback: T, isValid: (value: unknown) => value is T): T {
  const raw = readString(key)
  if (raw === null) {
    return fallback
  }
  try {
    const parsed: unknown = JSON.parse(raw)
    if (isValid(parsed)) {
      return parsed
    }
  } catch {
    // битый JSON — ниже вернём fallback
  }
  return fallback
}

export function writeJson(key: string, value: unknown): boolean {
  return writeString(key, JSON.stringify(value))
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((v) => typeof v === 'string')
}

/** Удалить все данные прототипа из localStorage и sessionStorage. */
export function clearAppStorage() {
  for (const store of [local(), session()]) {
    if (!store) {
      continue
    }
    try {
      const keys: string[] = []
      for (let i = 0; i < store.length; i++) {
        const key = store.key(i)
        if (key && key.startsWith(APP_PREFIX)) {
          keys.push(key)
        }
      }
      keys.forEach((key) => {
        store.removeItem(key)
      })
    } catch {
      // хранилище недоступно — и сбрасывать нечего
    }
  }
}

/**
 * Вызывается один раз до первого рендера.
 * Нет отметки версии — данные записаны текущим форматом (версия 1), просто ставим отметку.
 * Отметка другой версии — формат несовместим, сбрасываем всё и засеваем демо заново.
 */
export function ensureStorageSchema() {
  const stored = readString(SCHEMA_KEY)
  if (stored !== null && stored !== String(SCHEMA_VERSION)) {
    clearAppStorage()
  }
  writeString(SCHEMA_KEY, String(SCHEMA_VERSION))
}
