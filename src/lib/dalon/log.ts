import type { DalonLogEntry, DalonState, LogSource } from '../../types/dalon'

/** Сколько записей журнала храним на устройстве. */
const LOG_LIMIT = 30

export function logEntry(text: string, source: LogSource): DalonLogEntry {
  return {
    id: `l-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    at: new Date().toISOString(),
    text,
    source,
  }
}

/** Новая запись в начало журнала. */
export function withLog(state: DalonState, text: string, source: LogSource): DalonState['log'] {
  return [logEntry(text, source), ...state.log].slice(0, LOG_LIMIT)
}
