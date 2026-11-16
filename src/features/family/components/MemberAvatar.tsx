import clsx from 'clsx'
import { Icon, type IconName } from '../../../design-system'
import type { AssetKind, MemberKind } from '../../../types/dalon'

/** Люди — тёплые тона, имущество — зелёные, как листья на стебле. */
const KIND_CLASS: Record<MemberKind, string> = {
  adult: 'bg-family-sand text-family-sand-ink',
  child: 'bg-family-peach text-family-peach-ink',
  car: 'bg-plant-tint text-plant-ink',
  flat: 'bg-plant-tint text-plant-ink',
  dacha: 'bg-plant-tint text-plant-ink',
}

export const ASSET_ICON: Record<AssetKind, IconName> = {
  car: 'car',
  flat: 'home',
  dacha: 'dacha',
}

const SIZE_CLASS = {
  sm: 'w-8 h-8 text-[11px]',
  md: 'w-10 h-10 text-xs',
  lg: 'w-12 h-12 text-sm',
}

type MemberAvatarProps = {
  kind: MemberKind
  initials: string
  size?: keyof typeof SIZE_CLASS
  className?: string
}

/** Кружок с инициалами; у имущества — значок машины, дома или дачи. */
export function MemberAvatar({ kind, initials, size = 'md', className }: MemberAvatarProps) {
  return (
    <span
      aria-hidden="true"
      className={clsx(
        'inline-flex items-center justify-center rounded-full font-bold shrink-0 tracking-tight',
        KIND_CLASS[kind],
        SIZE_CLASS[size],
        className,
      )}
    >
      {kind === 'adult' || kind === 'child' ? (
        initials
      ) : (
        <Icon name={ASSET_ICON[kind]} className="w-[55%] h-[55%]" />
      )}
    </span>
  )
}
