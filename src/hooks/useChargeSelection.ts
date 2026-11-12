import { useCallback, useMemo, useState } from 'react'
import type { DalonCharge } from '../types/dalon'
import { defaultSelection } from '../lib/dalon/selectors'

const KEY = 'epasluga-dalon-selection'

function readStored(): string[] | null {
  try {
    const raw = JSON.parse(sessionStorage.getItem(KEY) || 'null')
    return Array.isArray(raw) ? raw : null
  } catch {
    return null
  }
}

function store(ids: string[]) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(ids))
  } catch {
    // без sessionStorage выбор просто не переживёт перезагрузку
  }
}

/**
 * Какие начисления отмечены к оплате.
 * Живёт в sessionStorage: при переходе на экран оплаты и обратно выбор сохраняется.
 * По умолчанию отмечено то, что нужно оплатить в ближайшие 14 дней.
 */
export function useChargeSelection(charges: DalonCharge[], now: Date) {
  const [stored, setStored] = useState<string[] | null>(readStored)

  const selected = useMemo(() => {
    const base = stored ?? defaultSelection(charges, now)
    // Оплаченные и скрытые начисления из выбора выпадают сами
    return base.filter((id) => charges.some((c) => c.id === id))
  }, [stored, charges, now])

  const set = useCallback((ids: string[]) => {
    store(ids)
    setStored(ids)
  }, [])

  const toggle = useCallback(
    (id: string) => {
      set(selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id])
    },
    [selected, set],
  )

  const allSelected = charges.length > 0 && selected.length === charges.length

  const toggleAll = useCallback(() => {
    set(allSelected ? [] : charges.map((c) => c.id))
  }, [allSelected, charges, set])

  return { selected, toggle, toggleAll, allSelected, set }
}
