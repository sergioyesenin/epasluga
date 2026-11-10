import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Input, Card } from '../../design-system'
import { useAuth } from '../../contexts/AuthContext'

const PHONE_RE = /^\+375\s?\(?(?:17|25|29|33|44)\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/
const DEMO_CODE = '1234'
const MAX_ATTEMPTS = 3
const RESEND_SECONDS = 60

function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '').replace(/^375/, '').slice(0, 9)
  if (digits.length === 0) return '+375 '
  const p1 = digits.slice(0, 2)
  const p2 = digits.slice(2, 5)
  const p3 = digits.slice(5, 7)
  const p4 = digits.slice(7, 9)

  let out = `+375 (${p1}`
  if (digits.length >= 2) out += ')'
  if (p2) out += ` ${p2}`
  if (p3) out += `-${p3}`
  if (p4) out += `-${p4}`
  return out
}

/** Иконка отпечатка пальца. */
function FingerprintIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 4c-3.9 0-7 3.1-7 7v2" />
      <path d="M19 13v-2c0-3.9-3.1-7-7-7" />
      <path d="M9 14v-3a3 3 0 1 1 6 0v4" />
      <path d="M12 14v3" />
      <path d="M9 18v2" />
      <path d="M15 18v2" />
      <path d="M5 17v2" />
      <path d="M19 17v2" />
    </svg>
  )
}

export function LoginPage() {
  const [step, setStep] = useState<1 | 2>(1)
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [phoneError, setPhoneError] = useState<string | null>(null)
  const [codeError, setCodeError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [attemptsLeft, setAttemptsLeft] = useState(MAX_ATTEMPTS)
  const [resendIn, setResendIn] = useState(0)
  const [bioLoading, setBioLoading] = useState(false)
  const [bioError, setBioError] = useState<string | null>(null)

  const navigate = useNavigate()
  const { login } = useAuth()

  const canSendCode = PHONE_RE.test(phone.trim())

  useEffect(() => {
    if (resendIn <= 0) return
    const t = window.setInterval(() => setResendIn((s) => Math.max(0, s - 1)), 1000)
    return () => window.clearInterval(t)
  }, [resendIn])

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSendCode) {
      setPhoneError('Введите номер в формате +375 (29) 123-45-67')
      return
    }
    setPhoneError(null)
    setIsLoading(true)
    window.setTimeout(() => {
      setIsLoading(false)
      setStep(2)
      setAttemptsLeft(MAX_ATTEMPTS)
      setResendIn(RESEND_SECONDS)
    }, 600)
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (code.length !== 4) {
      setCodeError('Введите 4 цифры из SMS')
      return
    }
    if (code !== DEMO_CODE) {
      const next = attemptsLeft - 1
      setAttemptsLeft(next)
      setCodeError(
        next > 0 ? `Неверный код. Осталось попыток: ${next}` : 'Попытки исчерпаны',
      )
      return
    }
    setCodeError(null)
    setIsLoading(true)
    window.setTimeout(() => {
      login()
      navigate('/')
    }, 600)
  }

  const handleResend = () => {
    if (resendIn > 0) return
    setResendIn(RESEND_SECONDS)
    setAttemptsLeft(MAX_ATTEMPTS)
    setCodeError(null)
    setCode('')
  }

  const handleChangeNumber = () => {
    setStep(1)
    setCode('')
    setCodeError(null)
    setAttemptsLeft(MAX_ATTEMPTS)
    setResendIn(0)
  }

  const handleAltLogin = () => {
    login()
    navigate('/')
  }

  /**
   * Демо-биометрия.
   * В реальном приложении здесь был бы вызов WebAuthn
   * (navigator.credentials.get) с проверкой подписи сервером.
   * Сейчас — имитация: задержка и успешный вход.
   */
  const handleBiometricLogin = () => {
    setBioError(null)
    setBioLoading(true)
    window.setTimeout(() => {
      // Проверяем, что браузер вообще поддерживает WebAuthn.
      // В демо это не обязательно, но показывает, где будет реальная логика.
      if (typeof window !== 'undefined' && 'PublicKeyCredential' in window) {
        login()
        navigate('/')
      } else {
        setBioLoading(false)
        setBioError('Биометрия недоступна на этом устройстве')
      }
    }, 700)
  }

  return (
    <div className="max-w-md mx-auto py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-navy-deep mb-2">Вход в Е-Паслуга</h1>
        <p className="text-muted">Выберите удобный способ входа</p>
      </div>

      <Card className="p-6 md:p-8 shadow-lg border-line">
        {step === 1 ? (
          <form onSubmit={handleSendCode} className="space-y-6">
            <div>
              <label htmlFor="login-phone" className="block text-sm font-semibold mb-2">
                Номер телефона
              </label>
              <Input
                id="login-phone"
                type="tel"
                inputMode="tel"
                autoFocus
                placeholder="+375 (29) 123-45-67"
                value={phone}
                onChange={(e) => {
                  setPhone(formatPhone(e.target.value))
                  if (phoneError) setPhoneError(null)
                }}
                isError={!!phoneError}
                className="h-12"
              />
              {phoneError ? (
                <p className="text-danger text-xs mt-1">{phoneError}</p>
              ) : (
                <p className="text-xs text-muted mt-2">Демо-режим: любые валидные данные</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base"
              disabled={isLoading || !canSendCode}
            >
              {isLoading ? 'Отправка…' : 'Получить код'}
            </Button>

            {/* --- Биометрический вход --- */}
            <div className="relative text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-line" />
              </div>
              <span className="relative bg-white px-3 text-xs text-muted">или</span>
            </div>

            <div className="space-y-2">
              <Button
                type="button"
                variant="ghost"
                className="w-full h-11 flex items-center justify-center gap-2"
                onClick={handleBiometricLogin}
                disabled={bioLoading}
              >
                <FingerprintIcon />
                {bioLoading ? 'Проверка биометрии…' : 'Войти по биометрии'}
              </Button>
              <p className="text-xs text-muted text-center">
                Face ID или отпечаток пальца — если настроено на устройстве
              </p>
              {bioError && (
                <p className="text-danger text-xs text-center">{bioError}</p>
              )}
            </div>

            <div className="space-y-2 pt-2 border-t border-line">
              <Button
                type="button"
                variant="ghost"
                className="w-full h-11"
                onClick={handleAltLogin}
              >
                Войти через ЭЦП
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full h-11"
                onClick={handleAltLogin}
              >
                Войти через Google / Apple
              </Button>
            </div>

            <p className="text-xs text-muted text-center pt-2">
              Ваши данные защищены. Оператор — НЦЭУ.
            </p>
          </form>
        ) : (
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <button
                type="button"
                onClick={handleChangeNumber}
                className="text-sm text-navy hover:underline mb-4"
              >
                ← Изменить номер
              </button>

              <label htmlFor="login-code" className="block text-sm font-semibold mb-2">
                Код из SMS
              </label>
              <Input
                id="login-code"
                type="text"
                inputMode="numeric"
                autoFocus
                placeholder="••••"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.replace(/\D/g, '').slice(0, 4))
                  if (codeError) setCodeError(null)
                }}
                isError={!!codeError}
                className="h-12 text-center text-2xl tracking-[0.5em]"
              />
              {codeError ? (
                <p className="text-danger text-xs mt-1">{codeError}</p>
              ) : (
                <p className="text-xs text-muted mt-2">Демо-код: {DEMO_CODE}</p>
              )}
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-muted">Осталось попыток: {attemptsLeft}</span>
              <button
                type="button"
                disabled={resendIn > 0}
                onClick={handleResend}
                className="text-navy hover:underline disabled:text-muted disabled:no-underline"
              >
                {resendIn > 0
                  ? `Отправить код повторно через ${resendIn} с`
                  : 'Отправить код повторно'}
              </button>
            </div>

            {attemptsLeft === 0 && (
              <div className="bg-[#fdecea] border border-[#f5c2c0] rounded-control p-3 text-xs text-danger">
                Попытки исчерпаны. Обратитесь в{' '}
                <a
                  href="https://support.nces.by"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline font-semibold"
                >
                  службу поддержки
                </a>
                .
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 text-base"
              disabled={isLoading || code.length !== 4 || attemptsLeft === 0}
            >
              {isLoading ? 'Проверка…' : 'Войти'}
            </Button>
          </form>
        )}
      </Card>
    </div>
  )
}