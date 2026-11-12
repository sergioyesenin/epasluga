import { useEffect, useState, type FormEvent } from 'react'

const PHONE_RE = /^\+375\s?\(?(?:17|25|29|33|44)\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/
export const DEMO_CODE = '1234'
const MAX_ATTEMPTS = 3
const RESEND_SECONDS = 60

/** Маска «+375 (29) 123-45-67». */
export function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '').replace(/^375/, '').slice(0, 9)
  if (digits.length === 0) {
    return '+375 '
  }
  const p1 = digits.slice(0, 2)
  const p2 = digits.slice(2, 5)
  const p3 = digits.slice(5, 7)
  const p4 = digits.slice(7, 9)

  let out = `+375 (${p1}`
  if (digits.length >= 2) {
    out += ')'
  }
  if (p2) {
    out += ` ${p2}`
  }
  if (p3) {
    out += `-${p3}`
  }
  if (p4) {
    out += `-${p4}`
  }
  return out
}

/** Вход по SMS (демо): номер → код, три попытки, повторная отправка через минуту. */
export function useSmsLogin(onSuccess: () => void) {
  const [step, setStep] = useState<'phone' | 'code'>('phone')
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [phoneError, setPhoneError] = useState<string | null>(null)
  const [codeError, setCodeError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [attemptsLeft, setAttemptsLeft] = useState(MAX_ATTEMPTS)
  const [resendIn, setResendIn] = useState(0)

  const canSendCode = PHONE_RE.test(phone.trim())

  useEffect(() => {
    if (resendIn <= 0) {
      return
    }
    const t = window.setInterval(() => {
      setResendIn((s) => Math.max(0, s - 1))
    }, 1000)
    return () => {
      window.clearInterval(t)
    }
  }, [resendIn])

  const changePhone = (value: string) => {
    setPhone(formatPhone(value))
    setPhoneError(null)
  }

  const changeCode = (value: string) => {
    setCode(value.replace(/\D/g, '').slice(0, 4))
    setCodeError(null)
  }

  const sendCode = (e: FormEvent) => {
    e.preventDefault()
    if (!canSendCode) {
      setPhoneError('Введите номер в формате +375 (29) 123-45-67')
      return
    }
    setPhoneError(null)
    setIsLoading(true)
    window.setTimeout(() => {
      setIsLoading(false)
      setStep('code')
      setAttemptsLeft(MAX_ATTEMPTS)
      setResendIn(RESEND_SECONDS)
    }, 600)
  }

  const verify = (e: FormEvent) => {
    e.preventDefault()
    if (code.length !== 4) {
      setCodeError('Введите 4 цифры из SMS')
      return
    }
    if (code !== DEMO_CODE) {
      const next = attemptsLeft - 1
      setAttemptsLeft(next)
      setCodeError(next > 0 ? `Неверный код. Осталось попыток: ${next}` : 'Попытки исчерпаны')
      return
    }
    setCodeError(null)
    setIsLoading(true)
    window.setTimeout(() => {
      setIsLoading(false)
      onSuccess()
    }, 600)
  }

  const resend = () => {
    if (resendIn > 0) {
      return
    }
    setResendIn(RESEND_SECONDS)
    setAttemptsLeft(MAX_ATTEMPTS)
    setCodeError(null)
    setCode('')
  }

  const backToPhone = () => {
    setStep('phone')
    setCode('')
    setCodeError(null)
    setAttemptsLeft(MAX_ATTEMPTS)
    setResendIn(0)
  }

  return {
    step,
    phone,
    code,
    phoneError,
    codeError,
    isLoading,
    attemptsLeft,
    resendIn,
    canSendCode,
    changePhone,
    changeCode,
    sendCode,
    verify,
    resend,
    backToPhone,
  }
}
