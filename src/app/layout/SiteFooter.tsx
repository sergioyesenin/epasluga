import { Link } from 'react-router-dom'

/** Подвал с элементами доверия. Нейтральный, внутри прокрутки страницы. */
export function SiteFooter() {
  return (
    <footer className="border-t border-line text-xs text-muted px-[max(1rem,env(safe-area-inset-left))] md:px-8 py-5">
      <div className="max-w-6xl flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <span>© 2026 НЦЭУ</span>
          <a
            href="https://nces.by"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-ink"
          >
            nces.by
          </a>
          <Link to="/about" className="underline underline-offset-2 hover:text-ink">
            Обработка персональных данных
          </Link>
          <Link to="/about" className="underline underline-offset-2 hover:text-ink">
            Безопасность
          </Link>
        </div>
        <p>Оператор — Национальный центр электронных услуг (УНП 191700161). Учебный прототип.</p>
      </div>
    </footer>
  )
}
