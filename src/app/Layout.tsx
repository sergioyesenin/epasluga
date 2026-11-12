import { Outlet, ScrollRestoration, useLocation } from 'react-router-dom'
import { AiAssistant } from '../features/support/AiAssistant'
import { OfflineBanner } from '../features/pwa/OfflineBanner'
import { Toaster } from '../design-system'
import { useAuth } from '../contexts/AuthContext'
import { Breadcrumbs } from './Breadcrumbs'
import { Sidebar } from './layout/Sidebar'
import { TopBar } from './layout/TopBar'
import { BottomTabs } from './layout/BottomTabs'
import { SiteFooter } from './layout/SiteFooter'
import { guestNav, memberNav } from './layout/navItems'

/**
 * Каркас приложения.
 * Прокручивается окно (а не внутренний блок) — так работают «назад» с восстановлением
 * позиции, scrollIntoView и сворачивание адресной строки на телефоне.
 */
export function Layout() {
  const { isAuthenticated } = useAuth()
  const { pathname } = useLocation()
  // В «Далони» снизу панель оплаты — кнопку помощника на телефоне прячем, чтобы не перекрывала
  const busyBottom = pathname.startsWith('/family')

  return (
    <div className="min-h-dvh flex bg-bg">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[70] focus:bg-card focus:text-navy focus:px-4 focus:py-3 focus:rounded-control focus:shadow-lift"
      >
        К содержимому
      </a>

      {isAuthenticated && <Sidebar />}

      <div className="flex-1 min-w-0 flex flex-col pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-0">
        <TopBar />
        <OfflineBanner />
        <main
          id="main"
          className="flex-1 w-full pt-5 md:pt-8 pb-10 pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] md:px-8"
        >
          <Breadcrumbs />
          <Outlet />
        </main>
        <SiteFooter />
      </div>

      <BottomTabs items={isAuthenticated ? memberNav : guestNav} member={isAuthenticated} />
      <AiAssistant hideFabOnMobile={busyBottom} />
      <Toaster />
      <ScrollRestoration />
    </div>
  )
}
