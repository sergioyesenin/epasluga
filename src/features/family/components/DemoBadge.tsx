import clsx from 'clsx'

/** Метка «Демо»: так помечено всё, чего нет в настоящем сервисе. */
export function DemoBadge({ className }: { className?: string }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-md border border-warn-line bg-warn-tint px-2 py-0.5 text-xs font-semibold text-warn',
        className,
      )}
    >
      Демо
    </span>
  )
}
