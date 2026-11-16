import { Component, type ErrorInfo, type ReactNode } from 'react'
import { ErrorScreen } from './ErrorScreen'

type Props = { children: ReactNode }
type State = { error: unknown; hasError: boolean }

/**
 * Последний рубеж: ошибки вне маршрутов (провайдеры, сам RouterProvider).
 * Ошибки экранов ловит errorElement роутера — там остаются шапка и навигация.
 */
export class AppErrorBoundary extends Component<Props, State> {
  state: State = { error: null, hasError: false }

  static getDerivedStateFromError(error: unknown): State {
    return { error, hasError: true }
  }

  componentDidCatch(error: unknown, info: ErrorInfo) {
    // Место для отправки в систему мониторинга (Sentry и т. п.) в продукте
    if (import.meta.env.DEV) {
      console.error(error, info.componentStack)
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="min-h-dvh bg-bg">
          <ErrorScreen error={this.state.error} />
        </main>
      )
    }
    return this.props.children
  }
}
