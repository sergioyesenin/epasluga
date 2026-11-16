import { useEffect } from 'react'

const APP_NAME = 'Е-Паслуга'

/** «Каталог услуг — Е-Паслуга»; без названия экрана — заголовок главной. */
export function formatTitle(title?: string) {
  if (!title) {
    return `${APP_NAME} — личный кабинет`
  }
  return `${title} — ${APP_NAME}`
}

/**
 * Заголовок вкладки для текущего экрана: его читают экранные дикторы при переходе,
 * он же виден в истории браузера и в переключателе приложений.
 */
export function useDocumentTitle(title: string | undefined) {
  useEffect(() => {
    if (title === undefined) {
      return
    }
    document.title = formatTitle(title)
  }, [title])
}
