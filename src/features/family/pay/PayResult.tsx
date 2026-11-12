import { Link } from 'react-router-dom'
import { Icon } from '../../../design-system'
import type { PaymentRecord } from '../../../types/dalon'
import { formatBYN } from '../../../lib/money'
import { downloadReceipts } from '../../../lib/dalon/receipt'
import { showToast } from '../../../lib/toast'
import { actionButton, quietButton, textButton } from '../components/styles'

export function PaySuccess({ items }: { items: PaymentRecord[] }) {
  const total = items.reduce((acc, h) => acc + h.amount, 0)
  return (
    <section aria-labelledby="pay-ok-title" className="bg-card border border-line rounded-card p-6 md:p-8 text-center animate-rise">
      <span className="mx-auto mb-4 w-16 h-16 rounded-full bg-ok-tint text-ok inline-flex items-center justify-center">
        <Icon name="check" className="w-8 h-8" strokeWidth={2.4} />
      </span>
      <h1 id="pay-ok-title" className="text-2xl font-bold text-ink">
        Оплачено {formatBYN(total)}
      </h1>
      <p className="text-muted mt-2 max-w-md mx-auto">
        Деньги ушли получателям через ЕРИП. Ведомства увидят оплату в течение рабочего дня — начисления
        уже убраны из панели.
      </p>
      <ul className="mt-6 divide-y divide-line border-y border-line text-left">
        {items.map((h) => (
          <li key={h.id} className="flex justify-between gap-4 py-3">
            <span className="min-w-0">
              <span className="block font-semibold text-ink leading-snug">{h.title}</span>
              <span className="block text-xs text-muted">Квитанция {h.receipt}</span>
            </span>
            <span className="tabular font-semibold text-ink whitespace-nowrap">{formatBYN(h.amount)}</span>
          </li>
        ))}
      </ul>
      <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
        <Link to="/family" className={actionButton}>
          Вернуться в Далонь
        </Link>
        <button
          type="button"
          className={quietButton}
          onClick={() => {
            downloadReceipts(items)
            showToast({ tone: 'ok', message: items.length > 1 ? 'Квитанции скачаны' : 'Квитанция скачана' })
          }}
        >
          <Icon name="download" className="w-5 h-5" />
          {items.length > 1 ? 'Скачать квитанции' : 'Скачать квитанцию'}
        </button>
      </div>
      <Link to="/family/history" className={`${textButton} mt-4`}>
        Вся история платежей
      </Link>
    </section>
  )
}

type PayFailProps = {
  total: number
  onRetry: () => void
  onChangeMethod: () => void
}

export function PayFail({ total, onRetry, onChangeMethod }: PayFailProps) {
  return (
    <section
      role="alert"
      aria-labelledby="pay-fail-title"
      className="bg-card border border-bad-line rounded-card p-6 md:p-8 animate-rise"
    >
      <span className="mb-4 w-14 h-14 rounded-full bg-bad-tint text-bad inline-flex items-center justify-center">
        <Icon name="alert" className="w-7 h-7" />
      </span>
      <h1 id="pay-fail-title" className="text-2xl font-bold text-ink">
        Платёж не прошёл. Деньги не списаны
      </h1>
      <p className="text-muted mt-2">
        Банк не ответил вовремя, и операция отменилась до списания. С вашего счёта ничего не ушло,
        начисления остались в списке.
      </p>
      <dl className="mt-5 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
        <dt className="text-muted">Сумма</dt>
        <dd className="font-semibold text-ink tabular">{formatBYN(total)}</dd>
        <dt className="text-muted">Что делать</dt>
        <dd className="text-ink">Повторите через минуту или выберите другой способ оплаты</dd>
      </dl>
      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <button type="button" className={actionButton} onClick={onRetry}>
          <Icon name="refresh" className="w-5 h-5" />
          Повторить
        </button>
        <button type="button" className={quietButton} onClick={onChangeMethod}>
          Выбрать другой способ
        </button>
      </div>
    </section>
  )
}
