import { useCallback, useState } from 'react'
import type { CareerProfileId, DalonPerson } from '../types/dalon'
import { CAREER_QUESTIONS } from '../data/career'
import { saveCareerResult, type CareerAnswers } from '../lib/dalon/career'

/** Тест на профориентацию: текущий вопрос, ответы, назад, сохранение результата. */
export function useCareerTest(person: DalonPerson | undefined, onDone: () => void) {
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<CareerAnswers>({})

  const question = CAREER_QUESTIONS[index]
  const total = CAREER_QUESTIONS.length
  const chosen = question ? answers[question.id] : undefined
  const isLast = index === total - 1

  const choose = useCallback(
    (profile: CareerProfileId) => {
      if (!question) {
        return
      }
      setAnswers((prev) => ({ ...prev, [question.id]: profile }))
    },
    [question],
  )

  const next = useCallback(() => {
    if (!chosen) {
      return
    }
    if (isLast) {
      if (person) {
        saveCareerResult(person, answers)
      }
      onDone()
      return
    }
    setIndex((i) => i + 1)
  }, [chosen, isLast, person, answers, onDone])

  const back = useCallback(() => {
    setIndex((i) => Math.max(0, i - 1))
  }, [])

  const restart = useCallback(() => {
    setAnswers({})
    setIndex(0)
  }, [])

  return { question, index, total, chosen, isLast, choose, next, back, restart }
}
