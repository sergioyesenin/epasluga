import { Button, Input } from '../../design-system'
import type { useSmsLogin } from '../../hooks/useSmsLogin'

type Props = { sms: ReturnType<typeof useSmsLogin>; autoFocus: boolean }

export function PhoneForm({ sms, autoFocus }: Props) {
  return (
    <form onSubmit={sms.sendCode} className="space-y-4" noValidate>
      <div>
        <label htmlFor="login-phone" className="block text-sm font-semibold mb-2">
          Номер телефона
        </label>
        <Input
          id="login-phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          autoFocus={autoFocus}
          placeholder="+375 (29) 123-45-67"
          value={sms.phone}
          onChange={(e) => {
            sms.changePhone(e.target.value)
          }}
          isError={Boolean(sms.phoneError)}
          aria-invalid={Boolean(sms.phoneError)}
          className="h-12"
        />
        {sms.phoneError ? (
          <p className="text-danger text-xs mt-1">{sms.phoneError}</p>
        ) : (
          <p className="text-xs text-muted mt-2">Демо-режим: любой номер белорусского оператора</p>
        )}
      </div>
      <Button type="submit" className="w-full h-12 text-base" disabled={sms.isLoading || !sms.canSendCode}>
        {sms.isLoading ? 'Отправляем код…' : 'Получить код'}
      </Button>
    </form>
  )
}
