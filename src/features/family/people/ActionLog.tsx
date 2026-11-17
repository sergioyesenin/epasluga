import { Icon, type IconName } from '../../../design-system'
import type { DalonLogEntry, LogSource } from '../../../types/dalon'
import { formatDay } from '../../../lib/dates'

const SOURCE: Record<LogSource, { icon: IconName; label: string }> = {
  you: { icon: 'user', label: 'Вы' },
  family: { icon: 'people', label: 'Семья' },
  zags: { icon: 'file', label: 'Реестр ЗАГС' },
  system: { icon: 'info', label: 'Система' },
}

/** Журнал действий: кто и когда изменил состав семьи, права или оплатил. */
export function ActionLog({ entries }: { entries: DalonLogEntry[] }) {
  return (
    <section aria-labelledby="log-title" className="bg-card border border-line rounded-card p-5">
      <h2 id="log-title" className="text-lg font-bold text-ink mb-3">
        Журнал действий
      </h2>
      <ol className="space-y-3 text-sm">
        {entries.slice(0, 8).map((l) => {
          const src = SOURCE[l.source ?? 'system']
          return (
            <li key={l.id} className="flex gap-3">
              <span className="text-muted tabular whitespace-nowrap w-20 shrink-0">
                {formatDay(l.at)}
              </span>
              <Icon name={src.icon} className="w-4.5 h-4.5 shrink-0 mt-0.5 text-muted" />
              <span className="min-w-0 text-ink">
                <span className="sr-only">{src.label}: </span>
                {l.text}
              </span>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
