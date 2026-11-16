import clsx from 'clsx'
import { Icon } from '../../../design-system'
import type { useCareerTest } from '../../../hooks/useCareerTest'
import { actionButton, textButton } from '../components/styles'

type CareerQuizProps = {
  test: ReturnType<typeof useCareerTest>
  name: string
}

/** Один вопрос теста: варианты — радиокнопки во всю ширину, «Назад» и «Дальше». */
export function CareerQuiz({ test, name }: CareerQuizProps) {
  const { question, index, total, chosen, isLast } = test
  if (!question) {
    return null
  }

  return (
    <section
      aria-labelledby="quiz-step"
      className="bg-card border border-line rounded-card p-5 md:p-7"
    >
      <p id="quiz-step" className="text-sm text-muted">
        Вопрос {index + 1} из {total}. Отвечает {name}
      </p>
      <div
        className="mt-2 h-1.5 rounded-full bg-family-wine-tint overflow-hidden"
        role="progressbar"
        aria-label="Пройдено вопросов"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={index}
      >
        <div
          className="h-full rounded-full bg-family-wine transition-[width] duration-300"
          style={{ width: `${(index / total) * 100}%` }}
        />
      </div>

      <fieldset key={question.id} className="mt-6 animate-rise">
        <legend className="text-xl md:text-2xl font-bold text-ink leading-snug mb-4">
          {question.text}
        </legend>
        <div className="grid sm:grid-cols-2 gap-2.5">
          {question.options.map((o) => (
            <label
              key={o.profile}
              className={clsx(
                'flex items-center gap-3 min-h-14 rounded-xl border px-4 py-3 cursor-pointer transition-colors',
                'has-focus-visible:outline-3 has-focus-visible:outline-family-wine',
                chosen === o.profile
                  ? 'border-family-wine bg-family-wine-tint text-family-wine-ink font-semibold'
                  : 'border-line-2 hover:border-family-wine/50 text-ink',
              )}
            >
              <input
                type="radio"
                name={question.id}
                className="w-5 h-5 accent-family-wine shrink-0"
                checked={chosen === o.profile}
                onChange={() => {
                  test.choose(o.profile)
                }}
              />
              {o.text}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-6 flex items-center justify-between gap-3">
        <button type="button" className={textButton} disabled={index === 0} onClick={test.back}>
          <Icon name="chevronLeft" className="w-5 h-5" />
          Назад
        </button>
        <button type="button" className={actionButton} disabled={!chosen} onClick={test.next}>
          {isLast ? 'Показать результат' : 'Дальше'}
        </button>
      </div>
    </section>
  )
}
