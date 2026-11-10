import clsx from 'clsx'

export function Skeleton({ className = 'h-5 w-full' }: { className?: string }) {
  return <div className={clsx('bg-line/60 rounded animate-pulse', className)} />
}

export function SkeletonList({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-3" aria-busy="true" aria-label="Загрузка">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="bg-white border border-line rounded-card p-4 flex gap-3">
          <Skeleton className="w-10 h-10 rounded-xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  )
}