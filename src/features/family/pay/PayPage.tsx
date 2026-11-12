import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { EmptyState, Icon } from '../../../design-system'
import { useDalon } from '../../../hooks/useDalon'
import { useOnlineStatus } from '../../../hooks/useOnlineStatus'
import { usePayment } from '../../../hooks/usePayment'
import { memberById } from '../../../data/dalon'
import { amountDue, isDiscountActive, sumDue } from '../../../lib/dalon/selectors'
import { formatMoney } from '../../../lib/money'
import { MemberAvatar } from '../components/MemberAvatar'
import { FraudNote, NoWalletNote } from '../components/SafetyNotes'
import { actionButton, textButton } from '../components/styles'
import { PayMethods } from './PayMethods'
import { PayFail, PaySuccess } from './PayResult'

function BackLink() {
  return (
    <Link to="/family" className={`${textButton} mb-4`}>
      <Icon name="chevronLeft" className="w-5 h-5" />
      К панели Далони
    </Link>
  )
}

/** Подтверждение оплаты: что платим, чем платим, демо-успех и демо-сбой. */
export function PayPage() {
  const [params] = useSearchParams()
  const ids = useMemo(() => (params.get('ids') ?? '').split(',').filter(Boolean), [params])
  const { charges, now } = useDalon()
  const online = useOnlineStatus()
  const payment = usePayment(ids)

  const list = charges.filter((c) => ids.includes(c.id))
  const total = sumDue(list, now)
  const busy = payment.stage === 'processing'

  if (payment.stage === 'ok') {
    return (
      <div className="max-w-2xl mx-auto">
        <PaySuccess items={payment.result} />
      </div>
    )
  }

  if (list.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <BackLink />
        <EmptyState
          icon={<Icon name="check" />}
          title="Оплачивать нечего"
          description="Выбранные начисления уже оплачены или больше не показываются. Оплаченное — в истории."
          action={
            <Link to="/family/history" className={textButton}>
              История платежей
            </Link>
          }
        />
      </div>
    )
  }

  if (payment.stage === 'fail') {
    return (
      <div className="max-w-2xl mx-auto">
        <BackLink />
        <PayFail total={total} onRetry={payment.pay} onChangeMethod={payment.changeMethod} />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <BackLink />
      <h1 className="text-[28px] font-bold text-ink tracking-tight">Подтверждение оплаты</h1>
      <p className="text-muted mt-1 mb-6">Проверьте, что оплачиваете, и выберите способ.</p>

      <section aria-label="Что оплачиваете" className="bg-card border border-line rounded-card">
        <ul className="divide-y divide-line">
          {list.map((c) => {
            const m = memberById(c.memberId)
            return (
              <li key={c.id} className="flex items-center gap-3 px-4 py-3">
                {m && <MemberAvatar kind={m.kind} initials={m.initials} size="sm" />}
                <span className="flex-1 min-w-0">
                  <span className="block font-semibold text-ink leading-snug">{c.title}</span>
                  <span className="block text-xs text-muted">{c.payee}</span>
                </span>
                <span className="text-right tabular whitespace-nowrap">
                  {isDiscountActive(c, now) && (
                    <span className="block text-xs text-muted line-through">{formatMoney(c.amount)}</span>
                  )}
                  <span className="font-semibold text-ink">{formatMoney(amountDue(c, now))} BYN</span>
                </span>
              </li>
            )
          })}
        </ul>
        <p className="flex justify-between items-baseline px-4 py-4 border-t-2 border-line">
          <span className="font-semibold text-ink">Итого</span>
          <span className="tabular text-2xl font-bold text-family-wine">{formatMoney(total)} BYN</span>
        </p>
      </section>

      <div className="mt-6 space-y-5">
        <PayMethods value={payment.method} onChange={payment.setMethod} disabled={busy} />
        <NoWalletNote />
        <FraudNote />

        <label className="flex items-center gap-3 min-h-11 text-sm text-muted cursor-pointer">
          <input
            type="checkbox"
            checked={payment.simulateFail}
            disabled={busy}
            onChange={(e) => {
              payment.setSimulateFail(e.target.checked)
            }}
            className="w-5 h-5 accent-family-wine"
          />
          Демо: смоделировать сбой банка
        </label>

        {!online && (
          <p role="status" className="flex gap-3 rounded-xl bg-warn-tint border border-warn-line px-4 py-3 text-sm text-warn">
            <Icon name="offline" className="w-5 h-5 shrink-0" />
            Нет сети. Оплата пройдёт, когда появится интернет, — начисления никуда не денутся.
          </p>
        )}

        <button
          type="button"
          className={`${actionButton} w-full text-[17px]`}
          disabled={busy || !online}
          onClick={payment.pay}
          aria-busy={busy}
        >
          {busy ? (
            <>
              <span className="w-5 h-5 rounded-full border-2 border-family-wine-deep/30 border-t-family-wine-deep animate-spin" />
              Ждём ответ банка
            </>
          ) : (
            `Оплатить ${formatMoney(total)} BYN`
          )}
        </button>
      </div>
    </div>
  )
}
