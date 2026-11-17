import { useEffect, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import clsx from 'clsx'
import { EmptyState, Icon } from '../../../design-system'
import { TESTING_DISCLAIMER } from '../../../data/testing'
import { useDalon } from '../../../hooks/useDalon'
import { WIZARD_STEPS, useTestingWizard } from '../../../hooks/useTestingWizard'
import { personAccess, personById } from '../../../lib/dalon/selectors'
import { DemoBadge } from '../components/DemoBadge'
import { actionButton, textButton } from '../components/styles'
import { ConfirmStep, DateStep, KindStep, SubjectsStep } from './TestingSteps'
import { TestingDone } from './TestingDone'

/** Мастер регистрации на РТ / ЦТ / ЦЭ внутри Е-Паслуги. */
export function TestingPage() {
  const { memberId = '' } = useParams()
  const { state, now } = useDalon()
  const person = personById(state, memberId)
  const w = useTestingWizard(person)
  const last = w.step === WIZARD_STEPS.length - 1
  const stepsRef = useRef<HTMLOListElement>(null)

  // Новый шаг показываем с начала, а не там, где была кнопка «Дальше»
  useEffect(() => {
    const el = stepsRef.current
    if (el && el.getBoundingClientRect().top < 0) {
      el.scrollIntoView({ block: 'start' })
    }
  }, [w.step])

  const back = (
    <Link to="/family" className={`${textButton} mb-3`}>
      <Icon name="chevronLeft" className="w-5 h-5" />К панели Далони
    </Link>
  )

  if (!person || personAccess(person, now) !== 'open') {
    return (
      <div className="max-w-3xl">
        {back}
        <EmptyState
          icon={<Icon name="school" />}
          title="Нет доступа"
          description="Зарегистрировать на тестирование можно ребёнка, чьи законные представители — вы."
        />
      </div>
    )
  }

  if (w.done) {
    return (
      <div className="max-w-3xl">
        <TestingDone reg={w.done} />
      </div>
    )
  }

  return (
    <div className="max-w-3xl">
      {back}
      <h2 className="text-2xl md:text-[28px] font-bold text-ink tracking-tight">
        Регистрация на РТ / ЦТ / ЦЭ
      </h2>
      <p className="text-muted mt-1 max-w-[60ch]">
        Сдаёт: {person.full}. Сейчас это делают на сайте РИКЗ — здесь всё в одном месте: заявка,
        оплата, пропуск и напоминание о дне тестирования.
      </p>
      <p className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted">
        <DemoBadge />
        {TESTING_DISCLAIMER}
      </p>

      <ol
        ref={stepsRef}
        aria-label="Шаги регистрации"
        className="mt-6 mb-5 grid grid-cols-4 gap-1.5"
      >
        {WIZARD_STEPS.map((s, i) => (
          <li
            key={s}
            aria-current={i === w.step ? 'step' : undefined}
            className="text-xs sm:text-sm"
          >
            <span
              className={clsx(
                'block h-1.5 rounded-full mb-1.5',
                i <= w.step ? 'bg-family-wine' : 'bg-family-wine-tint',
              )}
            />
            <span className={i === w.step ? 'font-semibold text-ink' : 'text-muted'}>
              {i + 1}. {s}
            </span>
          </li>
        ))}
      </ol>

      <section
        aria-label={WIZARD_STEPS[w.step]}
        className="bg-card border border-line rounded-card p-5 md:p-7"
      >
        <div key={w.step} className="animate-rise">
          {w.step === 0 && <KindStep w={w} />}
          {w.step === 1 && <SubjectsStep w={w} />}
          {w.step === 2 && <DateStep w={w} />}
          {w.step === 3 && <ConfirmStep w={w} name={person.name} />}
        </div>

        <p aria-live="polite" className="mt-5 min-h-5 text-sm text-muted">
          {w.problem}
        </p>
        <div className="mt-2 flex items-center justify-between gap-3">
          <button type="button" className={textButton} disabled={w.step === 0} onClick={w.back}>
            <Icon name="chevronLeft" className="w-5 h-5" />
            Назад
          </button>
          <button
            type="button"
            className={actionButton}
            disabled={w.problem !== null}
            onClick={last ? w.submit : w.next}
          >
            {last ? 'Отправить заявку' : 'Дальше'}
          </button>
        </div>
      </section>
    </div>
  )
}
