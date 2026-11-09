import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import { lifeSituations } from '../../data/situations'
import { Card, Badge, Button } from '../../design-system'

export function SituationPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const situation = lifeSituations.find((s) => s.id === id)
  const [completed, setCompleted] = useState<Set<string>>(new Set())

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

  const progress = Math.round((completed.size / situation.steps.length) * 100)

  const toggleStep = (stepId: string) => {
    setCompleted((prev) => {
      const next = new Set(prev)
      if (next.has(stepId)) next.delete(stepId)
      else next.add(stepId)
      return next
    })
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
          <div className="flex items-center gap-3 w-full md:w-auto">
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
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-navy-deep mb-2">Ваши шаги</h2>
          {situation.steps.map((step, index) => {
            const isDone = completed.has(step.id)
            return (
              <Card
                key={step.id}
                className={clsx('relative', isDone && 'opacity-60 bg-soft')}
              >
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => toggleStep(step.id)}
                    aria-pressed={isDone}
                    className={clsx(
                      'shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center mt-1 transition-colors',
                      isDone
                        ? 'bg-ok border-ok text-white'
                        : 'border-line text-muted hover:border-navy hover:text-navy',
                    )}
                  >
                    {isDone ? '✓' : index + 1}
                  </button>

                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1 gap-2">
                      <h3
                        className={clsx(
                          'font-semibold text-navy-deep text-lg',
                          isDone && 'line-through',
                        )}
                      >
                        {step.title}
                      </h3>
                      {step.isOptional && <Badge>Опционально</Badge>}
                    </div>
                    {step.description && (
                      <p className="text-muted text-sm mb-4">{step.description}</p>
                    )}

                    <div className="flex flex-wrap gap-3 items-center">
                      {step.serviceId ? (
                        <Button onClick={() => navigate(`/service/${step.serviceId}`)}>
                          Оформить онлайн
                        </Button>
                      ) : step.externalAction ? (
                        <Button
                          variant="ghost"
                          onClick={() => alert(step.externalAction)}
                        >
                          Как сделать офлайн
                        </Button>
                      ) : null}
                      {step.estimatedTime && (
                        <span className="text-xs text-muted">
                          ⏱ {step.estimatedTime}
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
              <li>• Прогресс сохраняется только в этой сессии — не закрывайте вкладку.</li>
            </ul>
          </Card>

          {situation.faq && situation.faq.length > 0 && (
            <Card className="bg-soft border-line">
              <h3 className="font-bold text-navy-deep mb-3">Частые вопросы</h3>
              {situation.faq.map((item, i) => (
                <div key={i} className="mb-3 last:mb-0">
                  <p className="font-semibold text-ink text-sm mb-1">
                    {item.question}
                  </p>
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