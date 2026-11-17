import { Link } from 'react-router-dom'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'

/** Неизвестный адрес: старая ссылка, опечатка, удалённый раздел. */
export function NotFoundPage() {
  useDocumentTitle('Страница не найдена')

  return (
    <div className="max-w-xl mx-auto py-12 text-center">
      <p className="text-5xl font-bold text-navy mb-4" aria-hidden="true">
        404
      </p>
      <h1 className="text-2xl font-bold text-ink mb-3">Страница не найдена</h1>
      <p className="text-muted mb-6">
        Возможно, ссылка устарела или в адресе опечатка. Найдите нужную услугу в каталоге или
        вернитесь на главную.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          to="/"
          className="inline-flex items-center justify-center rounded-control px-4 min-h-11 text-[15px] font-semibold bg-navy text-white hover:bg-navy-deep"
        >
          На главную
        </Link>
        <Link
          to="/catalog"
          className="inline-flex items-center justify-center rounded-control px-4 min-h-11 text-[15px] font-semibold bg-white text-navy border border-navy hover:bg-soft"
        >
          Каталог услуг
        </Link>
      </div>
    </div>
  )
}
