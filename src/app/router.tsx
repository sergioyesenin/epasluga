import { createHashRouter, type RouteObject } from 'react-router-dom'
import { Layout } from './Layout'
import { RequireAuth } from './RequireAuth'
import { HomeSwitcher } from './HomeSwitcher'
import { RouteError } from './errors/RouteError'
import type { RouteHandle } from './routeTitle'
import { NotFoundPage } from '../features/not-found/NotFoundPage'
import { lazyNamed } from '../lib/lazyNamed'

/*
 * Каждый экран — отдельный чанк (React.lazy). Пока чанк грузится, Layout показывает
 * скелетон. Все чанки лежат в precache service worker, поэтому после первого визита
 * экраны открываются и без сети.
 */
const CatalogPage = lazyNamed(() => import('../features/catalog/CatalogPage'), 'CatalogPage')
const ServicePage = lazyNamed(() => import('../features/service/ServicePage'), 'ServicePage')
const LoginPage = lazyNamed(() => import('../features/auth/LoginPage'), 'LoginPage')
const StatusPage = lazyNamed(() => import('../features/status/StatusPage'), 'StatusPage')
const SupportPage = lazyNamed(() => import('../features/support/SupportPage'), 'SupportPage')
const AboutPage = lazyNamed(() => import('../features/about/AboutPage'), 'AboutPage')
const ProfilePage = lazyNamed(() => import('../features/profile/ProfilePage'), 'ProfilePage')
const NotificationsPage = lazyNamed(
  () => import('../features/notifications/NotificationsPage'),
  'NotificationsPage',
)
const SituationPage = lazyNamed(
  () => import('../features/situations/SituationPage'),
  'SituationPage',
)
const PassportPage = lazyNamed(() => import('../features/passports/PassportPage'), 'PassportPage')
const DalonLayout = lazyNamed(() => import('../features/family/DalonLayout'), 'DalonLayout')
const PanelPage = lazyNamed(() => import('../features/family/panel/PanelPage'), 'PanelPage')
const RemindersPage = lazyNamed(
  () => import('../features/family/reminders/RemindersPage'),
  'RemindersPage',
)
const PeoplePage = lazyNamed(() => import('../features/family/people/PeoplePage'), 'PeoplePage')
const HistoryPage = lazyNamed(() => import('../features/family/history/HistoryPage'), 'HistoryPage')
const PayPage = lazyNamed(() => import('../features/family/pay/PayPage'), 'PayPage')
const CareerPage = lazyNamed(() => import('../features/family/career/CareerPage'), 'CareerPage')
const TestingPage = lazyNamed(() => import('../features/family/testing/TestingPage'), 'TestingPage')

const title = (value: string): RouteHandle => ({ title: value })

const screens: RouteObject[] = [
  // Пустой заголовок — «Е-Паслуга — личный кабинет»
  { index: true, element: <HomeSwitcher />, handle: title('') },
  { path: 'catalog', element: <CatalogPage />, handle: title('Каталог услуг') },
  // Заголовок ставит сама страница — по названию ситуации, паспорта или услуги
  { path: 'situation/:id', element: <SituationPage /> },
  { path: 'passport/:id', element: <PassportPage /> },
  { path: 'service/:id', element: <ServicePage /> },
  {
    path: 'family',
    element: (
      <RequireAuth>
        <DalonLayout />
      </RequireAuth>
    ),
    handle: title('Далонь'),
    children: [
      { index: true, element: <PanelPage />, handle: title('Далонь — панель семьи') },
      { path: 'reminders', element: <RemindersPage />, handle: title('Далонь — напоминания') },
      { path: 'people', element: <PeoplePage />, handle: title('Далонь — семья и права') },
      { path: 'history', element: <HistoryPage />, handle: title('Далонь — история') },
      {
        path: 'career/:memberId',
        element: <CareerPage />,
        handle: title('Далонь — профориентация'),
      },
      {
        path: 'testing/:memberId',
        element: <TestingPage />,
        handle: title('Далонь — регистрация на тестирование'),
      },
    ],
  },
  {
    path: 'family/pay',
    element: (
      <RequireAuth>
        <PayPage />
      </RequireAuth>
    ),
    handle: title('Далонь — оплата'),
  },
  { path: 'login', element: <LoginPage />, handle: title('Вход') },
  // Личные разделы — только после входа: в них данные конкретного человека
  {
    path: 'status/:id?',
    element: (
      <RequireAuth>
        <StatusPage />
      </RequireAuth>
    ),
    handle: title('Статус заявления'),
  },
  {
    path: 'profile',
    element: (
      <RequireAuth>
        <ProfilePage />
      </RequireAuth>
    ),
    handle: title('Личный кабинет'),
  },
  {
    path: 'notifications',
    element: (
      <RequireAuth>
        <NotificationsPage />
      </RequireAuth>
    ),
    handle: title('Уведомления'),
  },
  { path: 'support', element: <SupportPage />, handle: title('Поддержка') },
  { path: 'about', element: <AboutPage />, handle: title('О портале') },
  { path: '*', element: <NotFoundPage />, handle: title('Страница не найдена') },
]

export const router = createHashRouter([
  {
    path: '/',
    element: <Layout />,
    // Упал сам каркас — экран ошибки без шапки
    errorElement: <RouteError />,
    children: [
      {
        // Упал экран — шапка и навигация остаются, ошибка показывается на месте страницы
        errorElement: <RouteError />,
        children: screens,
      },
    ],
  },
])
