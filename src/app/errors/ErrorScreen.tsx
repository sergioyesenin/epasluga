import { Button } from '../../design-system'
import { clearAppStorage } from '../../lib/storage'
import { errorMessage, isChunkLoadError } from '../../lib/errors'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'

type ErrorScreenProps = {
  error: unknown
}

function reload() {
  window.location.reload()
}

function resetAndReload() {
  clearAppStorage()
  window.location.reload()
}

/**
 * Экран непредвиденной ошибки. Не зависит от роутера: показывается и когда упал сам каркас.
 * Ссылка на главную — обычная, с полной перезагрузкой, чтобы начать с чистого состояния.
 */
export function ErrorScreen({ error }: ErrorScreenProps) {
  const chunk = isChunkLoadError(error)
  useDocumentTitle('Ошибка')

  return (
    <div role="alert" className="max-w-xl mx-auto py-12 px-4 text-center">
      <h1 className="text-2xl font-bold text-ink mb-3">
        {chunk ? 'Не удалось загрузить экран' : 'Что-то пошло не так'}
      </h1>
      <p className="text-muted mb-6">
        {chunk
          ? 'Похоже, пропала сеть или вышла новая версия приложения. Перезагрузите страницу — ваши данные сохранятся.'
          : 'Экран не смог открыться. Перезагрузите страницу. Если ошибка повторяется, сбросьте демо-данные прототипа — они могли остаться от старой версии.'}
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button type="button" onClick={reload}>
          Перезагрузить
        </Button>
        <a
          href="./#/"
          className="inline-flex items-center justify-center rounded-control px-4 min-h-11 text-[15px] font-semibold bg-white text-navy border border-navy hover:bg-soft"
        >
          На главную
        </a>
      </div>
      {!chunk && (
        <button
          type="button"
          onClick={resetAndReload}
          className="mt-6 min-h-11 px-2 text-sm text-muted underline hover:text-danger"
        >
          Сбросить демо-данные и перезагрузить
        </button>
      )}
      <details className="mt-8 text-left text-xs text-muted">
        <summary className="cursor-pointer min-h-11 inline-flex items-center">
          Техническая информация
        </summary>
        <pre className="mt-2 p-3 bg-soft rounded-control whitespace-pre-wrap break-words">
          {errorMessage(error)}
        </pre>
      </details>
    </div>
  )
}
