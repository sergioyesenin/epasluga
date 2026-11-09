import { useCallback, useEffect, useState } from 'react'
import type { Application } from '../types/service'

const APPS_KEY = 'epasluga-apps'

const SEED: Application[] = [
  // ... существующие 6 записей без изменений
]

function read(): Application[] {
  try {
    const raw = JSON.parse(localStorage.getItem(APPS_KEY) || 'null')
    if (Array.isArray(raw)) return raw
  } catch { /* ignore */ }
  localStorage.setItem(APPS_KEY, JSON.stringify(SEED))
  return SEED
}

function write(rows: Application[]) {
  localStorage.setItem(APPS_KEY, JSON.stringify(rows))
}

export function useApplications() {
  const [apps, setApps] = useState<Application[]>(() => read())

  useEffect(() => {
    const onStorage = (e: StorageEvent) => { if (e.key === APPS_KEY) setApps(read()) }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const update = useCallback((id: string, patch: Partial<Application>) => {
    setApps((prev) => {
      const next = prev.map((a) => (a.id === id ? { ...a, ...patch } : a))
      write(next)
      return next
    })
  }, [])

  const remove = useCallback((id: string) => {
    setApps((prev) => {
      const next = prev.filter((a) => a.id !== id)
      write(next)
      return next
    })
  }, [])

  /** Создать новую заявку (используется формой подачи). */
  const add = useCallback((app: Application) => {
    setApps((prev) => {
      const next = [app, ...prev]
      write(next)
      return next
    })
  }, [])

  return { apps, update, remove, add }
}