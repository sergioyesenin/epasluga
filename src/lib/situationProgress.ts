import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'epasluga-situation-progress'

/** Формат хранения: { [situationId]: Set<stepId> } — но в JSON Set не сериализуется,
 * поэтому храним как { [situationId]: string[] } и оборачиваем в Set в памяти. */
type StoredProgress = Record<string, string[]>

function read(): StoredProgress {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
      return raw as StoredProgress
    }
  } catch {
    // ignore corrupt storage
  }
  return {}
}

function write(data: StoredProgress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

/**
 * Хук прогресса прохождения жизненной ситуации.
 * Возвращает список выполненных шагов, функцию переключения и сброса.
 */
export function useSituationProgress(situationId: string) {
  const [completed, setCompleted] = useState<Set<string>>(() => {
    const stored = read()[situationId] ?? []
    return new Set(stored)
  })

  // Синхронизация между вкладками
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return
      const stored = read()[situationId] ?? []
      setCompleted(new Set(stored))
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [situationId])

  const toggle = useCallback(
    (stepId: string) => {
      setCompleted((prev) => {
        const next = new Set(prev)
        if (next.has(stepId)) next.delete(stepId)
        else next.add(stepId)

        // Сохраняем в localStorage
        const all = read()
        all[situationId] = [...next]
        write(all)

        return next
      })
    },
    [situationId],
  )

  const reset = useCallback(() => {
    setCompleted(new Set())
    const all = read()
    delete all[situationId]
    write(all)
  }, [situationId])

  return { completed, toggle, reset }
}

/**
 * Читает весь прогресс по всем ситуациям — для отображения в каталоге.
 * Возвращает объект вида { [situationId]: number } — количество выполненных шагов.
 */
export function useAllSituationProgress() {
  const [summary, setSummary] = useState<Record<string, number>>(() => computeSummary())

  function computeSummary() {
    const all = read()
    const result: Record<string, number> = {}
    for (const [k, v] of Object.entries(all)) {
      if (Array.isArray(v) && v.length > 0) result[k] = v.length
    }
    return result
  }

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setSummary(computeSummary())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  return summary
}