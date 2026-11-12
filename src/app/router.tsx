import { createHashRouter } from 'react-router-dom'
import { Layout } from './Layout'
import { useAuth } from '../contexts/AuthContext'

// Страницы
import { HomePage } from '../features/home/HomePage'
import { GuestHomePage } from '../features/guest-home/GuestHomePage'
import { CatalogPage } from '../features/catalog/CatalogPage'
import { ServicePage } from '../features/service/ServicePage'
import { LoginPage } from '../features/auth/LoginPage'
import { StatusPage } from '../features/status/StatusPage'
import { SupportPage } from '../features/support/SupportPage'
import { AboutPage } from '../features/about/AboutPage'
import { ProfilePage } from '../features/profile/ProfilePage'
import { NotificationsPage } from '../features/notifications/NotificationsPage'
import { SituationPage } from '../features/situations/SituationPage'
import { FamilyPage } from '../features/family/FamilyPage'

// Компонент-переключатель для главной страницы
function HomeSwitcher() {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <HomePage /> : <GuestHomePage />
}

export const router = createHashRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomeSwitcher /> },
      { path: 'catalog', element: <CatalogPage /> },
      { path: 'situation/:id', element: <SituationPage /> },
      { path: 'family', element: <FamilyPage /> },
      { path: 'service/:id', element: <ServicePage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'status/:id?', element: <StatusPage /> },
      { path: 'support', element: <SupportPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'notifications', element: <NotificationsPage /> },
    ],
  },
])
