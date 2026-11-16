import { isRouteErrorResponse, useRouteError } from 'react-router-dom'
import { NotFoundPage } from '../../features/not-found/NotFoundPage'
import { ErrorScreen } from './ErrorScreen'

/** errorElement маршрутов: 404 от роутера — страница «не найдено», остальное — экран ошибки. */
export function RouteError() {
  const error = useRouteError()
  if (isRouteErrorResponse(error) && error.status === 404) {
    return <NotFoundPage />
  }
  return <ErrorScreen error={error} />
}
