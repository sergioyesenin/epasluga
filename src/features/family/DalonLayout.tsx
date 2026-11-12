import { NavLink, Outlet } from 'react-router-dom'
import clsx from 'clsx'
import { useDalon } from '../../hooks/useDalon'
import { DalonMark } from './components/DalonMark'

const TABS = [
  { to: '/family', label: 'Панель', end: true },
  { to: '/family/reminders', label: 'Напоминания' },
  { to: '/family/people', label: 'Семья и права' },
  { to: '/family/history', label: 'История' },
]

/** Шапка «Далони» и вкладки раздела. */
export function DalonLayout() {
  const { pending } = useDalon()

  return (
    <div className="max-w-6xl mx-auto pb-6">
      <header className="flex items-center gap-3 mb-5">
        <DalonMark className="w-11 h-11 text-family-wine shrink-0" />
        <div>
          <h1 className="text-[28px] leading-none font-bold tracking-tight text-family-wine">
            Далонь
          </h1>
          <p className="text-sm text-muted mt-1">Всё о семье — в одной ладони</p>
        </div>
      </header>

      <nav
        aria-label="Разделы Далони"
        className="-mx-4 px-4 md:mx-0 md:px-0 mb-6 border-b border-line overflow-x-auto [scrollbar-width:none]"
      >
        <div className="flex gap-1 w-max">
          {TABS.map((t) => (
            <NavLink
              key={t.to}
              to={t.to}
              end={t.end}
              className={({ isActive }) =>
                clsx(
                  'relative inline-flex items-center gap-2 min-h-11 px-3 text-[15px] whitespace-nowrap transition-colors',
                  isActive
                    ? 'text-ink font-semibold after:absolute after:inset-x-2 after:-bottom-px after:h-[3px] after:rounded-full after:bg-family-wine'
                    : 'text-muted hover:text-ink',
                )
              }
            >
              {t.label}
              {t.to === '/family/people' && pending > 0 && (
                <span
                  className="min-w-5 h-5 px-1.5 rounded-full bg-family-wine-tint text-family-wine-ink text-xs font-semibold inline-flex items-center justify-center"
                  aria-label={`ждут согласия: ${pending}`}
                >
                  {pending}
                </span>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      <Outlet />
    </div>
  )
}
