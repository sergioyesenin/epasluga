import { useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { EmptyState, Icon } from '../../../design-system'
import { useDalon } from '../../../hooks/useDalon'
import { useCareerTest } from '../../../hooks/useCareerTest'
import { careerFor } from '../../../lib/dalon/career'
import { personAccess, personById } from '../../../lib/dalon/selectors'
import { textButton } from '../components/styles'
import { CareerQuiz } from './CareerQuiz'
import { CareerResults } from './CareerResults'

/** Тест на профориентацию и подбор колледжа или вуза. */
export function CareerPage() {
  const { memberId = '' } = useParams()
  const [params] = useSearchParams()
  const { state, now } = useDalon()
  const person = personById(state, memberId)
  const result = careerFor(state, memberId)
  const [quiz, setQuiz] = useState(!result && params.get('skip') !== '1')
  const test = useCareerTest(person, () => {
    setQuiz(false)
    window.scrollTo({ top: 0 })
  })

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
          description="Подбор доступен для детей, чьи законные представители — вы."
        />
      </div>
    )
  }

  return (
    <div className="max-w-4xl">
      {back}
      <h2 className="text-2xl md:text-[28px] font-bold text-ink tracking-tight">
        {quiz ? 'Тест на профориентацию' : 'Куда поступать'}
      </h2>
      <p className="text-muted mt-1 mb-6 max-w-[60ch]">
        {quiz
          ? `10 коротких вопросов для ${person.name}. Правильных ответов нет — выбирайте то, что ближе.`
          : 'Направления подготовки и учебные заведения рядом с домом.'}
      </p>
      {quiz ? (
        <CareerQuiz test={test} name={person.name} />
      ) : (
        <CareerResults
          key={result?.at ?? 'none'}
          person={person}
          result={result}
          onRetake={() => {
            test.restart()
            setQuiz(true)
          }}
        />
      )}
    </div>
  )
}
