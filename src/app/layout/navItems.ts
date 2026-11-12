import type { IconName } from '../../design-system'

export type NavItem = {
  to: string
  label: string
  icon: IconName
  end?: boolean
}

/** Основные разделы: сайдбар на компьютере и нижние вкладки на телефоне. */
export const memberNav: NavItem[] = [
  { to: '/', label: 'Главная', icon: 'home', end: true },
  { to: '/family', label: 'Далонь', icon: 'hand' },
  { to: '/catalog', label: 'Услуги', icon: 'grid' },
  { to: '/profile', label: 'Кабинет', icon: 'user' },
]

/** Второстепенные разделы — только в сайдбаре. */
export const memberNavExtra: NavItem[] = [
  { to: '/notifications', label: 'Уведомления', icon: 'bell' },
  { to: '/support', label: 'Поддержка', icon: 'help' },
  { to: '/about', label: 'О портале', icon: 'info' },
]

export const guestNav: NavItem[] = [
  { to: '/', label: 'Главная', icon: 'home', end: true },
  { to: '/catalog', label: 'Услуги', icon: 'grid' },
  { to: '/support', label: 'Помощь', icon: 'help' },
  { to: '/login', label: 'Войти', icon: 'login' },
]
