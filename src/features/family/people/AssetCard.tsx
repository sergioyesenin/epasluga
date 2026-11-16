import { Icon } from '../../../design-system'
import type { DalonAsset } from '../../../types/dalon'
import { MemberAvatar } from '../components/MemberAvatar'

/** Имущество: автомобиль, квартира, дача — у каждого свои начисления. */
export function AssetCard({ asset }: { asset: DalonAsset }) {
  return (
    <article className="bg-card border border-line rounded-card p-4 flex gap-3">
      <MemberAvatar kind={asset.kind} initials="" size="md" />
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-ink leading-snug">{asset.full}</h3>
        <p className="text-sm text-muted">
          {asset.detail}, {asset.owners}
        </p>
        <p className="mt-2 flex gap-2 text-xs text-muted">
          <Icon name="info" className="w-4 h-4 shrink-0" />
          {asset.source}
        </p>
      </div>
    </article>
  )
}
