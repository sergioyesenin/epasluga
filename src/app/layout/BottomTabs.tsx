import { NavLink } from 'react-router-dom'
import clsx from 'clsx'
import { Icon } from '../../design-system'
import { useDalonBadge } from '../../hooks/useDalonBadge'
import type { NavItem } from './navItems'

function Tab({ item, badge }: { item: NavItem; badge?: number }) {
  return (
    <NavLink
      to={item.to}
      end={item.end}
      className={({ isActive }) =>
        clsx(
          'relative flex-1 flex flex-col items-center justify-center gap-0.5 min-h-14 text-[11px] font-medium transition-colors',
          isActive ? 'text-navy' : 'text-muted active:text-ink',
        )
      }
    >
      {({ isActive }) => (
        <>
          <span
            className={clsx(
              'relative w-14 h-8 inline-flex items-center justify-center rounded-full transition-colors',
              isActive && 'bg-navy-tint',
            )}
          >
            <Icon name={item.icon} className="w-6 h-6" strokeWidth={isActive ? 2 : 1.8} />
            {badge ? (
              <span className="absolute -top-0.5 right-2 min-w-4.5 h-4.5 px-1 rounded-full bg-family-wine text-white text-[10px] font-bold leading-none inline-flex items-center justify-center tabular">
                {badge}
              </span>
            ) : null}
          </span>
          {item.label}
        </>
      )}
    </NavLink>
  )
}

function MemberTabs({ items }: { items: NavItem[] }) {
  const dalonBadge = useDalonBadge()
  return (
    <>
      {items.map((item) => (
        <Tab key={item.to} item={item} badge={item.to === '/family' ? dalonBadge : undefined} />
      ))}
    </>
  )
}

type BottomTabsProps = {
  items: NavItem[]
  /** Для вошедшего показываем значок срочных платежей «Далони». */
  member: boolean
}

/** Нижние вкладки на телефоне. Учитывают «домашнюю» полоску iPhone (safe-area снизу). */
export function BottomTabs({ items, member }: BottomTabsProps) {
  return (
    <nav
      aria-label="Разделы"
      className="md:hidden fixed inset-x-0 bottom-0 z-40 bg-card/95 backdrop-blur border-t border-line pb-safe pl-safe pr-safe"
    >
      <div className="flex items-stretch h-16 px-1">
        {member ? (
          <MemberTabs items={items} />
        ) : (
          items.map((item) => <Tab key={item.to} item={item} />)
        )}
      </div>
    </nav>
  )
}
