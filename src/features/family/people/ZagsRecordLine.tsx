import clsx from 'clsx'
import { Icon } from '../../../design-system'
import type { ZagsRecord } from '../../../types/dalon'
import { zagsRecordText } from '../../../lib/dalon/zags'

type ZagsRecordLineProps = {
  record: ZagsRecord
  /** basis — связь подтверждена; closed — связь закрыта этой записью. */
  variant: 'basis' | 'closed'
  className?: string
}

/** «Связь подтверждена записью ЗАГС № … от …» или «Связь закрыта записью …». */
export function ZagsRecordLine({ record, variant, className }: ZagsRecordLineProps) {
  const closed = variant === 'closed'
  return (
    <p className={clsx('flex gap-2 text-sm', closed ? 'text-ink' : 'text-muted', className)}>
      <Icon
        name={closed ? 'lock' : 'file'}
        className={clsx('w-4.5 h-4.5 shrink-0 mt-0.5', closed ? 'text-bad' : 'text-family-wine')}
      />
      <span>
        <span className={clsx('font-semibold', closed ? 'text-bad' : 'text-ink')}>
          {closed ? 'Связь закрыта' : 'Связь подтверждена'}
        </span>{' '}
        {zagsRecordText(record).replace('запись ЗАГС', 'записью ЗАГС')}{' '}
        <span className="text-muted">{record.office}.</span>
      </span>
    </p>
  )
}
