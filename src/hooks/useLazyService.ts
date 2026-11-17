import { useEffect, useState } from 'react'
import type { Service } from '../types/service'

type Catalog = typeof import('../data/catalog')

let loaded: Catalog | null = null

/**
 * Услуга по id без статического импорта каталога (~300 КБ).
 * Нужна каркасу приложения (хлебные крошки): иначе каталог попал бы в стартовый чанк
 * и грузился на каждом экране. На странице услуги каталог уже загружен — ответ мгновенный.
 */
export function useLazyService(id: string | undefined): Service | undefined {
  const [catalog, setCatalog] = useState<Catalog | null>(loaded)

  useEffect(() => {
    if (!id || catalog) {
      return
    }
    let alive = true
    import('../data/catalog')
      .then((mod) => {
        loaded = mod
        if (alive) {
          setCatalog(mod)
        }
      })
      .catch(() => {
        // чанк не загрузился (нет сети и нет кэша) — крошка останется общей «Услуга»
      })
    return () => {
      alive = false
    }
  }, [id, catalog])

  return catalog?.serviceById(id)
}
