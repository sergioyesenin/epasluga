import { lazy, type ComponentType } from 'react'

/**
 * React.lazy для модуля с именованным экспортом компонента.
 * Каждая страница уходит в свой чанк, а крупные данные (каталог, ситуации) — в общие
 * чанки, которые грузятся только там, где они нужны.
 */
export function lazyNamed<M, K extends keyof M>(load: () => Promise<M>, name: K) {
  type C = M[K] extends ComponentType<infer P> ? ComponentType<P> : never
  return lazy(async () => {
    const mod = await load()
    return { default: mod[name] as C }
  })
}
