import { useCallback, useEffect, useState } from 'react'
import { isStringArray, readJson, writeJson } from './storage'

const FAV_KEY = 'epasluga-favs'

function readFavs(): Set<string> {
  return new Set(readJson<string[]>(FAV_KEY, [], isStringArray))
}

function writeFavs(set: Set<string>) {
  writeJson(FAV_KEY, [...set])
}

/** Хук избранного с синхронизацией между вкладками. */
export function useFavorites() {
  const [favs, setFavs] = useState<Set<string>>(() => readFavs())

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === FAV_KEY) {
        setFavs(readFavs())
      }
    }
    window.addEventListener('storage', onStorage)
    return () => {
      window.removeEventListener('storage', onStorage)
    }
  }, [])

  const toggle = useCallback((id: string) => {
    setFavs((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      writeFavs(next)
      return next
    })
  }, [])

  const has = useCallback((id: string) => favs.has(id), [favs])

  return { favs, toggle, has }
}
