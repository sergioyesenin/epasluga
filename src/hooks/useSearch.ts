import { useEffect, useMemo, useState } from 'react'
import { suggestServices } from '../lib/search'
import type { Service } from '../types/service'

/** Подсказки для autocomplete с дебаунсом, чтобы не дёргать поиск на каждый символ. */
export function useSuggestions(query: string, delay = 120) {
  const [debounced, setDebounced] = useState(query)

  // Таймер — побочный эффект: внутри useMemo его очистка никогда не вызывалась
  useEffect(() => {
    const t = window.setTimeout(() => {
      setDebounced(query)
    }, delay)
    return () => {
      window.clearTimeout(t)
    }
  }, [query, delay])

  return useMemo<Service[]>(() => {
    if (!debounced.trim()) {
      return []
    }
    return suggestServices(debounced, 6)
  }, [debounced])
}
