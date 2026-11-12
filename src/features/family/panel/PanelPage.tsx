import { Link, useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import { EmptyState, Icon } from '../../../design-system'
import { useDalon } from '../../../hooks/useDalon'
import { useChargeSelection } from '../../../hooks/useChargeSelection'
import { DALON_MEMBERS } from '../../../data/dalon'
import { isMemberVisible, sumDue } from '../../../lib/dalon/selectors'
import { formatDay, toneFor, toneText } from '../../../lib/dates'
import type { DalonMemberId } from '../../../types/dalon'
import { HandSummary } from './HandSummary'
import { MemberGroup } from './MemberGroup'
import { DuePanel } from './DuePanel'
import { PayBar } from './PayBar'
import { NoWalletNote } from '../components/SafetyNotes'
import { textButton } from '../components/styles'

function scrollToMember(id: string) {
  const el = document.getElementById(`member-${id}`)
  if (!el) {
    return
  }
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
  el.focus({ preventScroll: true })
}

/** Панель «Далони»: ладонь, начисления по членам семьи, сроки и оплата. */
export function PanelPage() {
  const { state, charges, total, timeline, now } = useDalon()
  const { selected, toggle, toggleAll, allSelected } = useChargeSelection(charges, now)
  const navigate = useNavigate()

  const isHidden = (id: DalonMemberId) => !isMemberVisible(state, id)
  const chosen = charges.filter((c) => selected.includes(c.id))
  const next = timeline[0]

  const goPay = () => {
    navigate(`/family/pay?ids=${encodeURIComponent(selected.join(','))}`)
  }

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,560px)_minmax(0,1fr)] gap-6 lg:gap-12 items-end mb-10">
        <HandSummary
          charges={charges}
          total={total}
          now={now}
          isHidden={isHidden}
          onPick={scrollToMember}
        />
        <div className="lg:pb-4 space-y-4">
          <p className="text-2xl font-bold text-ink leading-tight tracking-tight">
            Реквизиты вводить не нужно
          </p>
          <p className="text-muted max-w-[46ch]">
            Налоги, штрафы ГАИ, садик, кружки, ЖКХ и связь приходят сюда сами. Отметьте, что
            оплатить, — и одна кнопка закроет всё сразу.
          </p>
          {next && (
            <p className="flex gap-3 items-start bg-card border border-line rounded-xl px-4 py-3 text-sm">
              <Icon
                name="calendar"
                className={clsx('w-5 h-5 shrink-0 mt-px', toneText[toneFor(next.date, now)])}
              />
              <span>
                Ближайший срок — <span className="font-semibold">{formatDay(next.date)}</span>:{' '}
                {next.title.charAt(0).toLowerCase() + next.title.slice(1)}
              </span>
            </p>
          )}
          <NoWalletNote />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-6 items-start">
        <div className="min-w-0">
          <div className="flex items-center justify-between gap-3 mb-3">
            <h2 className="text-lg font-bold text-ink">Начисления</h2>
            {charges.length > 0 && (
              <button type="button" onClick={toggleAll} className={textButton}>
                {allSelected ? 'Снять выбор' : 'Выбрать все'}
              </button>
            )}
          </div>

          {charges.length === 0 && !DALON_MEMBERS.some((m) => isHidden(m.id)) ? (
            <EmptyState
              icon={<Icon name="check" />}
              title="Семья ничего не должна"
              description="Новые начисления появятся здесь сами. Оплаченное — в истории."
              action={
                <Link to="/family/history" className={textButton}>
                  Открыть историю платежей
                </Link>
              }
            />
          ) : (
            <div className="space-y-4">
              {DALON_MEMBERS.map((m) => (
                <MemberGroup
                  key={m.id}
                  member={m}
                  charges={charges.filter((c) => c.memberId === m.id)}
                  hidden={isHidden(m.id)}
                  selected={selected}
                  now={now}
                  onToggle={toggle}
                />
              ))}
            </div>
          )}

          {charges.length > 0 && (
            <PayBar count={chosen.length} total={sumDue(chosen, now)} onPay={goPay} />
          )}
        </div>

        <DuePanel items={timeline} now={now} />
      </div>
    </div>
  )
}
