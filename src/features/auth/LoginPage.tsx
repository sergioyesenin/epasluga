import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button, Card, Icon } from '../../design-system'
import { useAuth } from '../../contexts/AuthContext'
import { useBiometric } from '../../hooks/useBiometric'
import { useSmsLogin } from '../../hooks/useSmsLogin'
import { PhoneForm } from './PhoneForm'
import { CodeForm } from './CodeForm'
import { BiometricOffer } from './BiometricOffer'

function Divider() {
  return (
    <div className="relative text-center my-5">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-line" />
      </div>
      <span className="relative bg-white px-3 text-xs text-muted">или</span>
    </div>
  )
}

/**
 * Вход. Биометрия — быстрый повторный вход на знакомом устройстве:
 * кнопка появляется, только если её включили после входа по SMS.
 */
export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/'
  const { login } = useAuth()
  const bio = useBiometric()
  const [offer, setOffer] = useState(false)
  const [bioLoading, setBioLoading] = useState(false)
  const [phoneMode, setPhoneMode] = useState(false)

  const finish = () => {
    navigate(from, { replace: true })
  }

  const sms = useSmsLogin(() => {
    login()
    if (bio.available && !bio.enrolled) {
      setOffer(true)
    } else {
      finish()
    }
  })

  /**
   * Демо: в настоящем приложении здесь navigator.credentials.get({ publicKey })
   * с challenge от сервера; ОС показывает свой экран отпечатка / Face ID.
   */
  const handleBiometric = () => {
    setBioLoading(true)
    window.setTimeout(() => {
      login()
      finish()
    }, 700)
  }

  const handleAltLogin = () => {
    login()
    finish()
  }

  const showBioFirst = bio.enrolled && !phoneMode && sms.step === 'phone'

  return (
    <div className="max-w-md mx-auto py-6 md:py-10">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-ink mb-2 tracking-tight">Вход в Е-Паслугу</h1>
        <p className="text-muted">Выберите удобный способ входа</p>
      </div>

      <Card className="p-6 md:p-8">
        {offer ? (
          <BiometricOffer
            onEnable={() => {
              bio.enable()
              finish()
            }}
            onSkip={finish}
          />
        ) : (
          <>
            {showBioFirst && (
              <div className="space-y-3">
                <Button
                  type="button"
                  className="w-full h-14 text-base gap-2"
                  onClick={handleBiometric}
                  disabled={bioLoading}
                >
                  <Icon name="fingerprint" className="w-6 h-6" />
                  {bioLoading ? 'Ждём подтверждение…' : 'Войти по отпечатку или Face ID'}
                </Button>
                <p className="text-xs text-muted text-center">Быстрый вход включён на этом устройстве</p>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full h-11"
                  onClick={() => {
                    setPhoneMode(true)
                  }}
                >
                  Войти по номеру телефона
                </Button>
              </div>
            )}

            {!showBioFirst && sms.step === 'phone' && (
              <>
                <PhoneForm sms={sms} autoFocus={!bio.enrolled} />
                {bio.enrolled ? (
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex items-center justify-center gap-2 min-h-11 text-sm font-semibold text-navy rounded-control hover:bg-soft"
                    onClick={() => {
                      setPhoneMode(false)
                    }}
                  >
                    <Icon name="fingerprint" className="w-5 h-5" />
                    Войти по отпечатку или Face ID
                  </button>
                ) : (
                  bio.available !== false && (
                    <p className="mt-3 flex gap-2 text-xs text-muted">
                      <Icon name="fingerprint" className="w-4 h-4 shrink-0" />
                      Вход по отпечатку или Face ID можно включить после первого входа — на этом устройстве.
                    </p>
                  )
                )}
              </>
            )}

            {sms.step === 'code' && <CodeForm sms={sms} />}

            {sms.step === 'phone' && (
              <>
                <Divider />
                <div className="space-y-2">
                  <Button type="button" variant="ghost" className="w-full h-11" onClick={handleAltLogin}>
                    Войти через ЭЦП или ID-карту
                  </Button>
                  <Button type="button" variant="ghost" className="w-full h-11" onClick={handleAltLogin}>
                    Войти через Google или Apple
                  </Button>
                </div>
              </>
            )}

            <p className="flex gap-2 text-xs text-muted mt-6">
              <Icon name="shield" className="w-4 h-4 shrink-0" />
              Е-Паслуга никогда не спрашивает код из SMS по телефону, в мессенджерах или по ссылке.
              Оператор — НЦЭУ.
            </p>
          </>
        )}
      </Card>
    </div>
  )
}
