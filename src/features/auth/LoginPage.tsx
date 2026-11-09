import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Input, Card } from '../../design-system'
import { useAuth } from '../../contexts/AuthContext'

export function LoginPage() {
  const [step, setStep] = useState<1 | 2>(1)
  const [identifier, setIdentifier] = useState('')
  const [code, setCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault()
    if (!identifier) return
    setIsLoading(true)
    // Имитация запроса к серверу
    setTimeout(() => {
      setIsLoading(false)
      setStep(2)
    }, 800)
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!code) return
    setIsLoading(true)
    // Имитация проверки кода
    setTimeout(() => {
      login()
      navigate('/')
    }, 800)
  }

  return (
    <div className="max-w-md mx-auto py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-navy-deep mb-2">Вход в Е-Паслуга</h1>
        <p className="text-muted">Используйте ID-карту или номер телефона</p>
      </div>

      <Card className="p-6 md:p-8 shadow-lg border-line">
        {step === 1 ? (
          <form onSubmit={handleSendCode} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div>
              <label className="block text-sm font-semibold mb-2">Номер телефона или ID-карты</label>
              <Input
                type="text"
                placeholder="+375 (XX) XXX-XX-XX"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="h-12"
                autoFocus
              />
              <p className="text-xs text-muted mt-2">В демо-режиме введите любые данные</p>
            </div>
            <Button type="submit" className="w-full h-12 text-base" disabled={isLoading || !identifier}>
              {isLoading ? 'Отправка...' : 'Получить код'}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleLogin} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <button 
                type="button" 
                onClick={() => setStep(1)} 
                className="text-sm text-navy hover:underline mb-4 flex items-center gap-1"
              >
                ← Изменить номер
              </button>
              <label className="block text-sm font-semibold mb-2">Код из SMS</label>
              <Input
                type="text"
                placeholder="Введите 4 цифры"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="h-12 text-center text-2xl tracking-[0.5em]"
                maxLength={4}
                autoFocus
              />
              <p className="text-xs text-muted mt-2">Демо-код: 1234</p>
            </div>
            <Button type="submit" className="w-full h-12 text-base" disabled={isLoading || code.length < 4}>
              {isLoading ? 'Проверка...' : 'Войти в кабинет'}
            </Button>
          </form>
        )}
      </Card>
    </div>
  )
}