import { useMemo, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import { lifeSituations } from '../../data/situations'
import { Card, Badge, Button } from '../../design-system'
import { useSituationProgress } from '../../lib/situationProgress'
import { useApplications } from '../../lib/applications'
import { CheckIcon, ClockIcon } from '../../lib/situationIcons'
import type { ApplicationStatus } from '../../types/service'

const PAUSE_KEY_PREFIX = 'epasluga-situ-paused:'

export function SituationPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const situation = lifeSituations.find((s) => s.id === id)
  const { completed, toggle, reset } = useSituationProgress(id ?? '__none__')
  const { apps } = useApplications()

  const [isPaused, setIsPaused] = useState<boolean>(() => {
    if (!id) return false
    return localStorage.getItem(PAUSE_KEY_PREFIX + id) === '1'
  })

  const togglePause = () => {
    if (!id) return
    const next = !isPaused
    setIsPaused(next)
    localStorage.setItem(PAUSE_KEY_PREFIX + id, next ? '1' : '0')
  }

  /** Найти активное заявление по услуге шага. */
  const findActiveApp = (stepServiceId?: string) => {
    if (!stepServiceId) return undefined
    return apps.find(
      (a) =>
        a.serviceId === stepServiceId &&
        (['На проверке', 'Ожидает оплаты', 'Черновик'] as ApplicationStatus[]).includes(
          a.status,
        ),
    )
  }

  const progress = useMemo(() => {
    if (!situation || situation.steps.length === 0) return 0
    return Math.round((completed.size / situation.steps.length) * 100)
  }, [situation, completed])

  if (!situation) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-navy-deep mb-4">Ситуация не найдена</h1>
        <Link to="/catalog?view=situations" className="text-navy hover:underline">
          Вернуться к списку ситуаций
        </Link>
      </div>
    )
  }

  const isComplete = completed.size >= situation.steps.length && situation.steps.length > 0

  const handleSkip = (stepId: string) => {
    if (!completed.has(stepId)) toggle(stepId)
  }

  const handleBack = (index: number) => {
    if (index <= 0) return
    const prev = situation.steps[index - 1]
    if (!prev) return
    // «Назад» снимает отметку с текущего и открывает предыдущий для переработки.
    // Если предыдущий уже выполнен — снимаем с него, иначе просто скроллим (визуально).
    if (completed.has(prev.id)) {
      toggle(prev.id)
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="mb-8">
        <div className="text-sm text-muted mb-2">
          <Link to="/catalog?view=situations" className="hover:text-navy">
            Жизненные ситуации
          </Link>{' '}
          / <span>{situation.title}</span>
        </div>
        <h1 className="text-3xl font-bold text-navy-deep mb-3">{situation.title}</h1>
        <p className="text-lg text-ink mb-4">{situation.painPoint}</p>

        <Card className="bg-[#f8f9ff] border-line flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-sm text-muted block mb-1">Результат</span>
            <span className="font-semibold text-navy">{situation.outcome}</span>
          </div>

          <div className="flex flex-col gap-3 w-full md:w-auto">
            <div className="flex items-center gap-3">
              <div className="h-2 w-full md:w-48 bg-line rounded-full overflow-hidden">
                <div
                  className="h-full bg-navy transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-sm font-bold text-navy whitespace-nowrap">
                {progress}%
              </span>
            </div>
            <div className="flex items-center gap-2 justify-end">
              <Button variant="ghost" size="sm" onClick={togglePause}>
                {isPaused ? 'Продолжить' : 'Приостановить'}
              </Button>
              <Link
                to="/apps"
                className="text-xs font-semibold text-navy hover:underline whitespace-nowrap"
              >
                Мои заявления
              </Link>
            </div>
          </div>
        </Card>

        {isPaused && (
          <div className="mt-3 bg-[#fff4e5] border border-[#edd9b3] rounded-control px-3 py-2 text-xs text-accent-warm">
            Ситуация приостановлена. Прогресс сохранён — можно вернуться позже.
          </div>
        )}

        {completed.size > 0 && (
          <div className="mt-3 text-right">
            <button
              type="button"
              onClick={() => {
                reset()
                setIsPaused(false)
                if (id) localStorage.setItem(PAUSE_KEY_PREFIX + id, '0')
              }}
              className="text-xs text-muted hover:text-danger transition-colors underline"
            >
              Сбросить прогресс
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-navy-deep mb-2">
            Ваши шаги
            {isComplete && (
              <span className="ml-2 inline-flex items-center gap-1 text-xs font-semibold text-ok bg-[#e6f6ec] px-2 py-1 rounded">
                <CheckIcon className="w-3.5 h-3.5" />
                Готово
              </span>
            )}
          </h2>

          {situation.steps.map((step, index) => {
            const isDone = completed.has(step.id)
            const activeApp = findActiveApp(step.serviceId)
            const isInProgress = !isDone && !!activeApp
            const isFirst = index === 0
            const isLast = index === situation.steps.length - 1

            return (
              <Card
                key={step.id}
                className={clsx(
                  'relative transition-opacity',
                  isDone && 'opacity-60 bg-soft',
                  isInProgress && 'border-navy/30 ring-1 ring-navy/10',
                )}
              >
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => toggle(step.id)}
                    aria-pressed={isDone}
                    aria-label={isDone ? 'Отметить шаг как невыполненный' : 'Отметить шаг как выполненный'}
                    className={clsx(
                      'shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center mt-1 transition-colors',
                      isDone
                        ? 'bg-ok border-ok text-white'
                        : isInProgress
                          ? 'border-navy text-navy bg-white'
                          : 'border-line text-muted hover:border-navy hover:text-navy',
                    )}
                  >
                    {isDone ? <CheckIcon className="w-4 h-4" /> : index + 1}
                  </button>

                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1 gap-2 flex-wrap">
                      <h3
                        className={clsx(
                          'font-semibold text-navy-deep text-lg',
                          isDone && 'line-through',
                        )}
                      >
                        {step.title}
                      </h3>
                      <div className="flex gap-2 flex-wrap">
                        {step.isOptional && <Badge>Опционально</Badge>}
                        {isInProgress && <Badge variant="need-id">В процессе</Badge>}
                        {step.estimatedTime && (
                          <span className="inline-flex items-center gap-1 text-xs text-muted">
                            <ClockIcon className="w-3.5 h-3.5" />
                            {step.estimatedTime}
                          </span>
                        )}
                      </div>
                    </div>
                    {step.description && (
                      <p className="text-muted text-sm mb-4">{step.description}</p>
                    )}

                    <div className="flex flex-wrap gap-2 items-center">
                      {step.serviceId ? (
                        isInProgress ? (
                          <Link
                            to="/apps"
                            className="inline-flex items-center justify-center rounded-control px-4 py-2.5 text-[15px] font-semibold bg-white text-navy border border-navy hover:bg-soft transition-colors"
                          >
                            Открыть в «Моих услугах»
                          </Link>
                        ) : (
                          <Button
                            onClick={() =>
                              navigate(
                                `/service/${step.serviceId}?from=situation&situation=${situation.id}&step=${step.id}`,
                              )
                            }
                          >
                            Оформить онлайн
                          </Button>
                        )
                      ) : step.externalAction ? (
                        <Button
                          variant="ghost"
                          onClick={() => alert(step.externalAction)}
                        >
                          Как сделать офлайн
                        </Button>
                      ) : null}

                      {step.isOptional && !isDone && (
                        <button
                          type="button"
                          onClick={() => handleSkip(step.id)}
                          className="text-sm text-muted underline hover:text-navy px-1"
                        >
                          Пропустить
                        </button>
                      )}

                      {!isFirst && (
                        <button
                          type="button"
                          onClick={() => handleBack(index)}
                          className="text-sm text-muted underline hover:text-navy px-1"
                        >
                          Назад
                        </button>
                      )}

                      {isLast && isComplete && (
                        <span className="text-sm font-semibold text-ok inline-flex items-center gap-1">
                          <CheckIcon className="w-4 h-4" />
                          Все шаги пройдены
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        <div className="space-y-6">
          <Card>
            <h3 className="font-bold text-navy-deep mb-3">Полезно знать</h3>
            <ul className="space-y-3 text-sm text-muted">
              <li>• Шаги можно выполнять в любом порядке, если не указано иначе.</li>
              <li>• Для онлайн-услуг понадобится ID-карта или ЭЦП.</li>
              <li>• Прогресс сохраняется автоматически на этом устройстве.</li>
            </ul>
            <div className="mt-4 pt-3 border-t border-line">
              <Link
                to="/apps"
                className="text-sm font-semibold text-navy hover:underline inline-flex items-center gap-1"
              >
                Мои заявления по этой ситуации
              </Link>
            </div>
          </Card>

          {situation.faq && situation.faq.length > 0 && (
            <Card className="bg-soft border-line">
              <h3 className="font-bold text-navy-deep mb-3">Частые вопросы</h3>
              {situation.faq.map((item, i) => (
                <div key={i} className="mb-3 last:mb-0">
                  <p className="font-semibold text-ink text-sm mb-1">{item.question}</p>
                  <p className="text-sm text-muted">{item.answer}</p>
                </div>
              ))}
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}