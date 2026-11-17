import { useMatches } from 'react-router-dom'

/** handle маршрута: статичный заголовок экрана. Динамические экраны ставят его сами. */
export type RouteHandle = {
  title?: string
}

/** Заголовок самого глубокого совпавшего маршрута, у которого он задан. */
export function useRouteTitle(): string | undefined {
  const matches = useMatches()
  for (let i = matches.length - 1; i >= 0; i--) {
    const handle = matches[i].handle as RouteHandle | undefined
    if (handle?.title !== undefined) {
      return handle.title
    }
  }
  return undefined
}
