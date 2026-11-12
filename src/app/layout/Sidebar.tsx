import { Link, NavLink } from 'react-router-dom'
import clsx from 'clsx'
import { AppMark, Icon } from '../../design-system'
import { useDalonBadge } from '../../hooks/useDalonBadge'
import { useInstallPrompt } from '../../hooks/useInstallPrompt'
import { memberNav, memberNavExtra, type NavItem } from './navItems'

function SideLink({ item, badge }: { item: NavItem; badge?: number }) {
  return (
    <NavLink
      to={item.to}
      end={item.end}
      className={({ isActive }) =>
        clsx(
          'group relative flex items-center gap-3 min-h-11 px-3 rounded-control text-[15px] transition-colors',
          isActive
            ? 'bg-navy-tint text-navy font-semibold'
            : 'text-muted hover:bg-soft hover:text-ink',
        )
      }
    >
      {({ isActive }) => (
        <>
          <span
            className={clsx(
              'absolute -left-3 top-2 bottom-2 w-1 rounded-r-full bg-navy transition-opacity',
              isActive ? 'opacity-100' : 'opacity-0',
            )}
            aria-hidden="true"
          />
          <Icon name={item.icon} className="w-5 h-5 shrink-0" />
          <span className="flex-1">{item.label}</span>
          {badge ? (
            <span
              className="min-w-6 h-6 px-1.5 rounded-full bg-family-wine-tint text-family-wine-ink text-xs font-semibold inline-flex items-center justify-center tabular"
              aria-label={`срочных начислений: ${badge}`}
            >
              {badge}
            </span>
          ) : null}
        </>
      )}
    </NavLink>
  )
}

/** Боковое меню на компьютере (только для вошедших). Светлое, синий — только у активного пункта. */
export function Sidebar() {
  const dalonBadge = useDalonBadge()
  const { mode, install } = useInstallPrompt()

  return (
    <aside className="hidden md:flex flex-col w-64 shrink-0 h-dvh sticky top-0 bg-card border-r border-line">
      <Link to="/" className="flex items-center gap-3 px-6 h-16 shrink-0">
        <AppMark className="w-8 h-8" />
        <span className="leading-tight">
          <span className="block font-bold text-ink text-[17px] tracking-tight">Е-Паслуга</span>
          <span className="block text-xs text-muted">личный кабинет</span>
        </span>
      </Link>

      <nav
        aria-label="Основные разделы"
        className="flex-1 overflow-y-auto px-3 pt-4 pb-4 flex flex-col gap-1"
      >
        {memberNav.map((item) => (
          <SideLink
            key={item.to}
            item={item}
            badge={item.to === '/family' ? dalonBadge : undefined}
          />
        ))}
        <div className="my-3 border-t border-line" />
        {memberNavExtra.map((item) => (
          <SideLink key={item.to} item={item} />
        ))}
      </nav>

      {mode === 'prompt' && (
        <div className="px-3 pb-4">
          <button
            type="button"
            onClick={() => {
              void install()
            }}
            className="w-full flex items-center gap-3 min-h-11 px-3 rounded-control text-[15px] text-muted hover:bg-soft hover:text-ink transition-colors"
          >
            <Icon name="download" className="w-5 h-5" />
            Установить приложение
          </button>
        </div>
      )}
    </aside>
  )
}
