import clsx from 'clsx'
import { Icon } from '../../../design-system'
import type { MemberKind } from '../../../types/dalon'

const KIND_CLASS: Record<MemberKind, string> = {
  adult: 'bg-family-sand text-family-sand-ink',
  child: 'bg-family-peach text-family-peach-ink',
  car: 'bg-family-rose text-family-rose-ink',
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

/** Кружок с инициалами; у автомобиля — значок машины. */
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
      {kind === 'car' ? <Icon name="car" className="w-[55%] h-[55%]" /> : initials}
    </span>
  )
}
