import { useAuth } from '../hooks/useAuth'
import { lazyNamed } from '../lib/lazyNamed'

const HomePage = lazyNamed(() => import('../features/home/HomePage'), 'HomePage')
const GuestHomePage = lazyNamed(
  () => import('../features/guest-home/GuestHomePage'),
  'GuestHomePage',
)

/** Главная: гостю — лендинг, после входа — личная главная. */
export function HomeSwitcher() {
  const { isAuthenticated } = useAuth()
  if (isAuthenticated) {
    return <HomePage />
  }
  return <GuestHomePage />
}
