import { Link, NavLink, useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import { AppMark, Icon } from '../../design-system'
import { useAuth } from '../../contexts/AuthContext'
import { useNotifications } from '../../lib/notifications'

function initials(fullName: string): string {
  const [last, first] = fullName.split(' ')
  return `${first?.[0] ?? ''}${last?.[0] ?? ''}`
}

/** Шапка: учитывает вырез экрана сверху (safe-area) в установленном приложении. */
export function TopBar() {
  const { isAuthenticated, user, logout } = useAuth()
  const { items } = useNotifications()
  const navigate = useNavigate()
  const unread = items.filter((n) => !n.archived).length

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-30 bg-card/95 backdrop-blur border-b border-line pt-safe">
      <div className="h-14 md:h-16 flex items-center justify-between gap-3 pl-[max(1rem,env(safe-area-inset-left))] pr-[max(0.5rem,env(safe-area-inset-right))] md:px-8">
        <Link to="/" className={clsx('flex items-center gap-2.5 min-h-11', isAuthenticated && 'md:hidden')}>
          <AppMark className="w-7 h-7" />
          <span className="font-bold text-ink text-[17px] tracking-tight">Е-Паслуга</span>
        </Link>
        {isAuthenticated && (
          <span className="hidden md:block text-sm text-muted">Личный кабинет гражданина</span>
        )}

        {isAuthenticated ? (
          <div className="flex items-center gap-1 md:gap-3">
            <Link
              to="/notifications"
              className="relative w-11 h-11 inline-flex items-center justify-center rounded-xl text-muted hover:text-ink hover:bg-soft transition-colors"
              aria-label={unread > 0 ? `Уведомления: ${unread} новых` : 'Уведомления'}
            >
              <Icon name="bell" className="w-6 h-6" />
              {unread > 0 && (
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-danger rounded-full ring-2 ring-card" />
              )}
            </Link>
            <Link
              to="/profile"
              className="flex items-center gap-2.5 min-h-11 pl-1 pr-1 md:pr-2 rounded-xl hover:bg-soft transition-colors"
              aria-label="Личный кабинет"
            >
              <span className="w-9 h-9 bg-soft text-ink rounded-full inline-flex items-center justify-center text-xs font-bold">
                {user ? initials(user.name) : 'ИА'}
              </span>
              <span className="hidden sm:block text-sm font-semibold text-ink">
                {user?.name.split(' ')[1] ?? 'Профиль'}
              </span>
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="hidden sm:inline-flex items-center gap-2 min-h-11 px-3 rounded-xl text-sm font-medium text-muted hover:text-danger hover:bg-soft transition-colors"
            >
              <Icon name="logout" className="w-5 h-5" />
              Выйти
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1 sm:gap-2">
            <NavLink
              to="/catalog"
              className="hidden sm:inline-flex items-center min-h-11 px-3 rounded-xl text-sm font-medium text-muted hover:text-ink hover:bg-soft"
            >
              Каталог услуг
            </NavLink>
            <NavLink
              to="/support"
              className="hidden sm:inline-flex items-center min-h-11 px-3 rounded-xl text-sm font-medium text-muted hover:text-ink hover:bg-soft"
            >
              Поддержка
            </NavLink>
            <Link
              to="/login"
              className="inline-flex items-center min-h-11 px-4 rounded-control bg-navy text-white text-sm font-semibold hover:bg-navy-deep transition-colors"
            >
              Войти
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}
