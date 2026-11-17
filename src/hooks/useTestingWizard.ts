import { useCallback, useMemo, useState } from 'react'
import type { DalonPerson, TestingKind, TestingRegistration } from '../types/dalon'
import { FAMILY_HOME } from '../data/dalon'
import { EDU_CITIES } from '../data/career'
import { MAX_SUBJECTS, TESTING_POINTS, testingSessions } from '../data/testing'
import { registerTesting, testingPrice, type TestingDraft } from '../lib/dalon/testing'

export const WIZARD_STEPS = ['Вид', 'Предметы', 'Дата и пункт', 'Проверка'] as const

/**
 * Мастер регистрации на РТ / ЦТ / ЦЭ: шаги, черновик, проверка шага, отправка.
 * После отправки — готовая регистрация (оплата идёт через «Далонь»).
 */
export function useTestingWizard(person: DalonPerson | undefined) {
  const [step, setStep] = useState(0)
  const [draft, setDraft] = useState<TestingDraft>({
    kind: 'rt',
    subjects: [],
    sessionId: '',
    city: FAMILY_HOME.city,
    point: TESTING_POINTS[FAMILY_HOME.city][0],
  })
  const [consent, setConsent] = useState(false)
  const [done, setDone] = useState<TestingRegistration | null>(null)

  const sessions = useMemo(() => testingSessions(draft.kind), [draft.kind])
  const points = TESTING_POINTS[draft.city] ?? []
  const price = testingPrice(draft.kind, draft.subjects.length)
  const cityName = EDU_CITIES.find((c) => c.id === draft.city)?.name ?? ''

  const setKind = useCallback((kind: TestingKind) => {
    setDraft((d) => ({ ...d, kind, sessionId: '' }))
  }, [])

  const toggleSubject = useCallback((subject: string) => {
    setDraft((d) => {
      if (d.subjects.includes(subject)) {
        return { ...d, subjects: d.subjects.filter((s) => s !== subject) }
      }
      if (d.subjects.length >= MAX_SUBJECTS) {
        return d
      }
      return { ...d, subjects: [...d.subjects, subject] }
    })
  }, [])

  const setSession = useCallback((sessionId: string) => {
    setDraft((d) => ({ ...d, sessionId }))
  }, [])

  const setCity = useCallback((city: string) => {
    setDraft((d) => ({ ...d, city, point: TESTING_POINTS[city]?.[0] ?? '' }))
  }, [])

  const setPoint = useCallback((point: string) => {
    setDraft((d) => ({ ...d, point }))
  }, [])

  /** Почему нельзя идти дальше — или null. */
  const problem = (() => {
    if (step === 1 && draft.subjects.length === 0) {
      return 'Выберите хотя бы один предмет.'
    }
    if (step === 2 && !draft.sessionId) {
      return 'Выберите дату тестирования.'
    }
    if (step === 2 && !draft.point) {
      return 'Выберите пункт тестирования.'
    }
    if (step === 3 && !consent) {
      return 'Отметьте согласие, чтобы отправить заявку.'
    }
    return null
  })()

  const next = useCallback(() => {
    setStep((s) => Math.min(s + 1, WIZARD_STEPS.length - 1))
  }, [])

  const back = useCallback(() => {
    setStep((s) => Math.max(s - 1, 0))
  }, [])

  const submit = useCallback(() => {
    if (!person) {
      return
    }
    setDone(registerTesting(person, draft, cityName))
  }, [person, draft, cityName])

  return {
    step,
    draft,
    consent,
    setConsent,
    sessions,
    points,
    price,
    cityName,
    problem,
    done,
    setKind,
    toggleSubject,
    setSession,
    setCity,
    setPoint,
    next,
    back,
    submit,
  }
}

export type TestingWizard = ReturnType<typeof useTestingWizard>
