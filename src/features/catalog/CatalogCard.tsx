import { Link } from 'react-router-dom'
import { Card, Badge, StarButton } from '../../design-system'
import { ClockIcon } from '../../lib/situationIcons'
import type { Service } from '../../types/service'

const AUTH_LABEL: Record<
  Service['authLevel'],
  { label: string; variant: 'accent' | 'need-id' | 'ecp'; hint: string }
> = {
  none: {
    label: 'Без ID',
    variant: 'accent',
    hint: 'Доступно после обычного входа в кабинет — ID-карта не нужна.',
  },
  id: {
    label: 'Нужна ID-карта',
    variant: 'need-id',
    hint: 'Для получения услуги понадобится войти через ID-карту и PIN-код.',
  },
  ecp: {
    label: 'Нужна ЭЦП',
    variant: 'ecp',
    hint: 'Заявление нужно подписать электронной цифровой подписью.',
  },
}

type CatalogCardProps = {
  service: Service
  isFavorite: boolean
  onToggleFavorite: () => void
}

export function CatalogCard({ service, isFavorite, onToggleFavorite }: CatalogCardProps) {
  const auth = AUTH_LABEL[service.authLevel]

  return (
    <Link to={`/service/${service.id}`} className="block h-full group">
      <Card variant="interactive" className="h-full p-0! overflow-hidden">
        <div className="flex items-start justify-between gap-2 p-4 pb-2">
          <h3 className="font-semibold text-navy leading-snug line-clamp-2 min-h-[2.6em]">
            {service.shortTitle}
          </h3>
          <StarButton active={isFavorite} onClick={onToggleFavorite} />
        </div>

        <p className="px-4 text-sm text-muted line-clamp-2 mb-3 min-h-[2.6em]">
          {service.plainDescription}
        </p>

        <div className="px-4 flex flex-wrap items-center gap-1.5 mb-4">
          <Badge variant={auth.variant} title={auth.hint}>
            {auth.label}
          </Badge>
          <Badge variant="code">{service.code}</Badge>
        </div>

        <div className="mt-auto px-4 py-3 border-t border-line flex items-center justify-between gap-3 text-xs">
          <span className="font-semibold text-navy-deep truncate" title={service.categoryTitle}>
            {service.categoryTitle}
          </span>
          <span className="text-muted whitespace-nowrap shrink-0 flex items-center gap-1">
            <ClockIcon className="w-3.5 h-3.5" />
            {service.timeToComplete}
          </span>
        </div>
      </Card>
    </Link>
  )
}