import { Skeleton } from '../design-system'

/** Заглушка, пока догружается чанк экрана. Повторяет общий ритм страниц: заголовок и карточки. */
export function PageSkeleton() {
  return (
    <div className="max-w-6xl mx-auto" role="status" aria-live="polite">
      <span className="sr-only">Загрузка экрана…</span>
      <Skeleton className="h-8 w-2/3 max-w-sm mb-3" />
      <Skeleton className="h-4 w-full max-w-md mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Skeleton className="h-28 rounded-card" />
        <Skeleton className="h-28 rounded-card" />
        <Skeleton className="h-28 rounded-card" />
      </div>
    </div>
  )
}
