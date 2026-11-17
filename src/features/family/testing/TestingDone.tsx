import { Link } from 'react-router-dom'
import { Icon } from '../../../design-system'
import type { TestingRegistration } from '../../../types/dalon'
import { TESTING_KINDS } from '../../../data/testing'
import { useDalonState } from '../../../hooks/useDalon'
import { formatDate } from '../../../lib/dates'
import { formatBYN } from '../../../lib/money'
import { actionButton, quietButton, textButton } from '../components/styles'

/** Заявка создана: что дальше — оплатить или ждать подтверждения. Статус берём из хранилища. */
export function TestingDone({ reg }: { reg: TestingRegistration }) {
  const state = useDalonState()
  const live = state.testing.find((t) => t.id === reg.id) ?? reg
  const info = TESTING_KINDS[live.kind]
  const waiting = live.status === 'awaiting-payment'

  return (
    <section
      aria-labelledby="testing-done"
      className="bg-card border border-line rounded-card p-6 md:p-8 animate-rise"
    >
      <span
        className={
          waiting
            ? 'mb-4 w-14 h-14 rounded-full bg-family-peach text-family-peach-ink inline-flex items-center justify-center'
            : 'mb-4 w-14 h-14 rounded-full bg-ok-tint text-ok inline-flex items-center justify-center'
        }
      >
        <Icon name={waiting ? 'card' : 'check'} className="w-7 h-7" strokeWidth={2.2} />
      </span>
      <h2 id="testing-done" className="text-2xl font-bold text-ink">
        {waiting && `Заявка на ${info.short} создана — осталось оплатить`}
        {live.status === 'submitted' && `Заявка на ${info.short} отправлена`}
        {live.status === 'registered' && `Регистрация на ${info.short} подтверждена`}
      </h2>
      <p className="text-muted mt-2 max-w-[60ch]">
        {formatDate(live.date)}, {live.city}, {live.point}. Предметы: {live.subjects.join(', ')}.
        {live.pass && ` Пропуск ${live.pass}.`} Напомним о дне тестирования заранее — срок уже в
        «Напоминаниях».
      </p>
      <p className="text-sm text-muted mt-2">Статус заявки — в «Моих услугах».</p>
      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        {waiting && live.chargeId && (
          <Link to={`/family/pay?ids=${live.chargeId}`} className={actionButton}>
            Оплатить {formatBYN(live.amount)}
          </Link>
        )}
        <Link to="/profile?tab=apps" className={waiting ? quietButton : actionButton}>
          Мои услуги
        </Link>
      </div>
      <Link to="/family" className={`${textButton} mt-4`}>
        Вернуться в Далонь
      </Link>
    </section>
  )
}
