import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import clsx from 'clsx'
import { ConfirmDialog, EmptyState, Icon } from '../../../design-system'
import type { PaymentRecord } from '../../../types/dalon'
import { useDalon } from '../../../hooks/useDalon'
import { DALON_MEMBERS, memberById } from '../../../data/dalon'
import { METHOD_LABEL } from '../../../lib/dalon/actions'
import { downloadReceipts } from '../../../lib/dalon/receipt'
import { resetDalon } from '../../../lib/dalon/store'
import { countText, formatDay, formatMonth } from '../../../lib/dates'
import { formatBYN, formatMoney } from '../../../lib/money'
import { showToast } from '../../../lib/toast'
import { textButton } from '../components/styles'

function groupByMonth(list: PaymentRecord[]) {
  const groups = new Map<string, { title: string; items: PaymentRecord[] }>()
  list.forEach((h) => {
    const d = new Date(h.paidAt)
    const key = `${d.getFullYear()}-${d.getMonth()}`
    const g = groups.get(key) ?? { title: formatMonth(d), items: [] }
    g.items.push(h)
    groups.set(key, g)
  })
  return [...groups.values()]
}

function HistoryRow({ h }: { h: PaymentRecord }) {
  return (
    <li className="flex flex-col sm:flex-row sm:items-center gap-x-4 gap-y-1 px-4 py-3">
      <span className="sm:w-24 shrink-0 text-xs sm:text-sm text-muted tabular">
        {formatDay(h.paidAt)}
      </span>
      <span className="flex-1 min-w-0">
        <span className="block font-semibold text-ink leading-snug">{h.title}</span>
        <span className="block text-xs text-muted">
          {memberById(h.memberId)?.name}, {METHOD_LABEL[h.method]}, квитанция {h.receipt}
        </span>
      </span>
      <span className="flex items-center justify-between gap-4">
        <span className="tabular font-semibold text-ink whitespace-nowrap">
          {formatBYN(h.amount)}
        </span>
        <button
          type="button"
          className={textButton}
          aria-label={`Скачать квитанцию: ${h.title}`}
          onClick={() => {
            downloadReceipts([h])
            showToast({ tone: 'ok', message: 'Квитанция скачана' })
          }}
        >
          <Icon name="download" className="w-4.5 h-4.5" />
          Квитанция
        </button>
      </span>
    </li>
  )
}

/** «История»: оплаченное за год, фильтр по члену семьи, квитанции. */
export function HistoryPage() {
  const { state } = useDalon()
  const [params, setParams] = useSearchParams()
  const [resetOpen, setResetOpen] = useState(false)
  const who = params.get('who') ?? ''

  const list = state.history
    .filter((h) => !who || h.memberId === who)
    .sort((a, b) => new Date(b.paidAt).getTime() - new Date(a.paidAt).getTime())
  const year = new Date().getFullYear()
  const yearSum = state.history
    .filter((h) => new Date(h.paidAt).getFullYear() === year)
    .reduce((acc, h) => acc + h.amount, 0)

  const chip = (id: string, label: string) => (
    <button
      key={id || 'all'}
      type="button"
      aria-pressed={who === id}
      onClick={() => {
        setParams(id ? { who: id } : {}, { replace: true })
      }}
      className={clsx(
        'min-h-11 px-4 rounded-full text-sm font-semibold border transition-colors',
        who === id
          ? 'bg-family-wine text-white border-family-wine'
          : 'bg-card text-ink border-line hover:border-family-wine',
      )}
    >
      {label}
    </button>
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <p>
          <span className="block text-sm text-muted">Оплачено через «Далонь» в {year} году</span>
          <span className="block tabular text-[32px] font-bold tracking-tight text-family-wine leading-tight">
            {formatMoney(yearSum)} BYN
          </span>
          <span className="block text-sm text-muted">
            {countText(state.history.length, 'платёж', 'платежа', 'платежей')}
          </span>
        </p>
        <div role="group" aria-label="Чьи платежи" className="flex flex-wrap gap-2">
          {chip('', 'Вся семья')}
          {DALON_MEMBERS.map((m) => chip(m.id, m.name))}
        </div>
      </div>

      {list.length === 0 ? (
        <EmptyState
          icon={<Icon name="receipt" />}
          title="Платежей пока нет"
          description={
            who
              ? 'У этого члена семьи ещё не было оплат через «Далонь».'
              : 'После первой оплаты здесь появятся квитанции.'
          }
          action={
            <Link to="/family" className={textButton}>
              К начислениям
            </Link>
          }
        />
      ) : (
        groupByMonth(list).map((g) => (
          <section key={g.title} aria-label={g.title}>
            <h2 className="text-lg font-bold text-ink mb-2">{g.title}</h2>
            <ul className="bg-card border border-line rounded-card divide-y divide-line">
              {g.items.map((h) => (
                <HistoryRow key={h.id} h={h} />
              ))}
            </ul>
          </section>
        ))
      )}

      <div className="pt-4 border-t border-line">
        <button
          type="button"
          className="inline-flex items-center gap-2 min-h-11 text-sm text-muted hover:text-ink"
          onClick={() => {
            setResetOpen(true)
          }}
        >
          <Icon name="refresh" className="w-4.5 h-4.5" />
          Вернуть демо-данные «Далони» к началу
        </button>
      </div>

      <ConfirmDialog
        open={resetOpen}
        title="Начать демо заново?"
        description="Начисления, история, согласия и настройки напоминаний вернутся к исходным. Это только учебные данные на этом устройстве."
        confirmLabel="Начать заново"
        onCancel={() => {
          setResetOpen(false)
        }}
        onConfirm={() => {
          resetDalon()
          try {
            sessionStorage.removeItem('epasluga-dalon-selection')
          } catch {
            // без sessionStorage выбор и так не сохраняется
          }
          setResetOpen(false)
          showToast({ tone: 'ok', message: 'Демо-данные «Далони» восстановлены' })
        }}
      />
    </div>
  )
}
