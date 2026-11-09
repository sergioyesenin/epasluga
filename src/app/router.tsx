import { createHashRouter } from 'react-router-dom'
import { Layout } from './Layout'
// Заменяем импорт HomePage на GuestHomePage
import { GuestHomePage } from '../features/guest-home/GuestHomePage' 
// import { HomePage } from '../features/home/HomePage' // Оставили для будущего
import { CatalogPage } from '../features/catalog/CatalogPage'
import { ServicePage } from '../features/service/ServicePage'
import { LoginPage } from '../features/auth/LoginPage'
import { StatusPage } from '../features/status/StatusPage'
import { SupportPage } from '../features/support/SupportPage'
import { AboutPage } from '../features/about/AboutPage'
import { ProfilePage } from '../features/profile/ProfilePage'
import { MyServicesPage } from '../features/my-services/MyServicesPage'
import { NotificationsPage } from '../features/notifications/NotificationsPage'
import { SituationPage } from '../features/situations/SituationPage'

export const router = createHashRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      // Роутим на гостевую версию
      { index: true, element: <GuestHomePage /> },
      
      // В будущем здесь будет проверка:
      // { index: true, element: isAuthenticated ? <HomePage /> : <GuestHomePage /> },
      
      { path: 'catalog', element: <CatalogPage /> },
      { path: 'situation/:id', element: <SituationPage /> },
      { path: 'service/:id', element: <ServicePage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'status/:id?', element: <StatusPage /> },
      { path: 'support', element: <SupportPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'apps', element: <MyServicesPage /> },
      { path: 'notifications', element: <NotificationsPage /> },
    ],
  },
])