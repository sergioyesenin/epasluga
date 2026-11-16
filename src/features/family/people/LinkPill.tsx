import { Icon } from '../../../design-system'

/** Статус связи: значок и текст, чтобы различалось и без цвета. */
export function LinkPill({ closed, text }: { closed: boolean; text?: string }) {
  if (closed) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-soft text-muted px-2.5 py-1 text-xs font-semibold">
        <Icon name="lock" className="w-3.5 h-3.5" />
        {text ?? 'Связь закрыта, нет доступа'}
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-ok-tint text-ok px-2.5 py-1 text-xs font-semibold">
      <Icon name="check" className="w-3.5 h-3.5" strokeWidth={2.4} />
      {text ?? 'Связь по записи ЗАГС'}
    </span>
  )
}
