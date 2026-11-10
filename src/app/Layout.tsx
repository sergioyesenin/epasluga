import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom'
import { AiAssistant } from '../features/support/AiAssistant'
import { Breadcrumbs } from './Breadcrumbs'
import { useNotifications } from '../lib/notifications'
import { useAuth } from '../contexts/AuthContext'
import clsx from 'clsx'

const navItems = [
  { to: '/', label: 'Главная', end: true, icon: 'home' },
  { to: '/catalog', label: 'Каталог', icon: 'grid' },
  { to: '/profile', label: 'Профиль', icon: 'user' },
]

const MobileIcon = ({ name }: { name: string }) => {
  const cls = 'w-6 h-6 mb-1'
  if (name === 'home')
    return (
      <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m4 11 8-7 8 7v9H4v-9Z" />
      </svg>
    )
  if (name === 'grid')
    return (
      <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <rect x="4" y="5" width="6" height="6" rx="1" />
        <rect x="14" y="5" width="6" height="6" rx="1" />
        <rect x="4" y="14" width="6" height="6" rx="1" />
        <rect x="14" y="14" width="6" height="6" rx="1" />
      </svg>
    )
  if (name === 'file')
    return (
      <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 4h7l5 5v11H7V4ZM14 4v5h5" />
      </svg>
    )
  if (name === 'user')
    return (
      <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <circle cx="12" cy="8" r="3.2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 19c1.5-3 4-4.5 7-4.5S17.5 16 19 19" />
      </svg>
    )
  return null
}

export function Layout() {
  const { items } = useNotifications()
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  const unreadCount = items.filter((n) => !n.archived).length

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="h-screen flex bg-bg relative overflow-hidden">
      {/* --- САЙДБАР (только для авторизованных, desktop) --- */}
      {isAuthenticated && (
        <aside className="hidden md:flex flex-col w-64 bg-navy text-white shrink-0 h-full">
          <Link
            to="/"
            className="p-5 font-bold text-xl hover:opacity-90 transition-opacity shrink-0"
          >
            Е-Паслуга
          </Link>
          <nav className="flex flex-col overflow-y-auto pb-4">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `px-5 py-3 text-sm hover:bg-white/10 ${isActive ? 'bg-white/15 font-semibold' : ''}`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <NavLink
              to="/support"
              className={({ isActive }) =>
                `px-5 py-3 text-sm hover:bg-white/10 ${isActive ? 'bg-white/15 font-semibold' : ''}`
              }
            >
              Поддержка
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `px-5 py-3 text-sm hover:bg-white/10 ${isActive ? 'bg-white/15 font-semibold' : ''}`
              }
            >
              О портале
            </NavLink>
          </nav>
        </aside>
      )}

      {/* --- ОСНОВНОЙ КОНТЕНТ --- */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        {/* Шапка */}
        <header className="h-16 bg-white border-b border-line flex items-center justify-between px-4 md:px-7 sticky top-0 z-30 shrink-0">
          <div className="flex items-center gap-3">
            <Link to="/" className="font-bold text-navy text-lg md:text-xl">
              Е-Паслуга
            </Link>
            <span className="text-muted text-sm hidden md:block">
              {isAuthenticated ? 'Личный кабинет гражданина' : 'Единый портал электронных услуг'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/notifications"
                  className="relative p-2 text-muted hover:text-navy transition-colors rounded-lg hover:bg-soft"
                  aria-label="Уведомления"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.8}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 16h12l-1.2-2.2V10a4.8 4.8 0 1 0-9.6 0v3.8L6 16ZM10 16a2 2 0 0 0 4 0"
                    />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-danger rounded-full border-2 border-white" />
                  )}
                </Link>

                <div className="flex items-center gap-3 border-l border-line pl-4">
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                  >
                    <span className="text-ink font-semibold text-sm hidden sm:block">
                      {user?.name.split(' ')[0] || 'Профиль'}
                    </span>
                    <div className="w-8 h-8 bg-navy text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {user?.name.substring(0, 2) || 'ИА'}
                    </div>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-sm font-medium text-muted hover:text-danger transition-colors hidden sm:block ml-2"
                  >
                    Выйти
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <NavLink
                  to="/catalog"
                  className="text-sm font-medium text-muted hover:text-navy hidden sm:block"
                >
                  Каталог услуг
                </NavLink>
                <NavLink
                  to="/support"
                  className="text-sm font-medium text-muted hover:text-navy hidden sm:block"
                >
                  Поддержка
                </NavLink>
                <Link
                  to="/login"
                  className="bg-navy text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-navy-deep transition-colors"
                >
                  Войти
                </Link>
              </div>
            )}
          </div>
        </header>

        {/* Контент страницы — скроллится только эта часть */}
        <main className="flex-1 p-4 md:p-7 pb-20 md:pb-7 overflow-y-auto">
          <Breadcrumbs />
          <Outlet />
        </main>

        {/* Футер: элементы доверия */}
        <footer className="bg-navy text-white/85 text-xs shrink-0 px-4 md:px-7 py-3 md:py-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div className="leading-relaxed flex flex-wrap items-center gap-x-2 gap-y-1">
              <span>© 2026 НЦЭУ</span>
              <span className="text-white/40">·</span>
              <a
                href="https://nces.by"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-white"
              >
                nces.by
              </a>
              <span className="text-white/40">·</span>
              <Link to="/about" className="underline hover:text-white">
                Политика обработки персональных данных
              </Link>
              <span className="text-white/40">·</span>
              <Link to="/about" className="underline hover:text-white">
                Безопасность
              </Link>
            </div>
            <div className="text-white/60">
              Оператор — Национальный центр электронных услуг (УНП 191700161)
            </div>
          </div>
        </footer>
      </div>

      {/* --- НИЖНЯЯ НАВИГАЦИЯ (только для авторизованных на мобилках) --- */}
      {isAuthenticated && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-line flex justify-around items-center h-16 z-40 pb-safe">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                clsx(
                  'flex flex-col items-center justify-center w-full h-full text-[10px] font-medium transition-colors',
                  isActive ? 'text-navy' : 'text-muted hover:text-navy',
                )
              }
            >
              <MobileIcon name={item.icon} />
              {item.label}
            </NavLink>
          ))}
        </nav>
      )}

      <AiAssistant />
    </div>
  )
}