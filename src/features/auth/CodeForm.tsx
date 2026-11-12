import { Button, Icon, Input } from '../../design-system'
import { DEMO_CODE, type useSmsLogin } from '../../hooks/useSmsLogin'

type Props = { sms: ReturnType<typeof useSmsLogin> }

export function CodeForm({ sms }: Props) {
  return (
    <form onSubmit={sms.verify} className="space-y-5" noValidate>
      <button
        type="button"
        onClick={sms.backToPhone}
        className="inline-flex items-center gap-1 min-h-11 -ml-2 px-2 rounded-lg text-sm text-navy hover:bg-soft"
      >
        <Icon name="chevronLeft" className="w-4.5 h-4.5" />
        Изменить номер
      </button>

      <div>
        <label htmlFor="login-code" className="block text-sm font-semibold mb-2">
          Код из SMS на {sms.phone}
        </label>
        <Input
          id="login-code"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          autoFocus
          placeholder="••••"
          value={sms.code}
          onChange={(e) => {
            sms.changeCode(e.target.value)
          }}
          isError={Boolean(sms.codeError)}
          aria-invalid={Boolean(sms.codeError)}
          className="h-12 text-center text-2xl tracking-[0.5em]"
        />
        {sms.codeError ? (
          <p className="text-danger text-xs mt-1">{sms.codeError}</p>
        ) : (
          <p className="text-xs text-muted mt-2">Демо-код: {DEMO_CODE}. Никому не сообщайте код из SMS.</p>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 text-xs">
        <span className="text-muted">Осталось попыток: {sms.attemptsLeft}</span>
        <button
          type="button"
          disabled={sms.resendIn > 0}
          onClick={sms.resend}
          className="min-h-11 text-navy hover:underline disabled:text-muted disabled:no-underline text-right"
        >
          {sms.resendIn > 0 ? `Отправить повторно через ${sms.resendIn} с` : 'Отправить код повторно'}
        </button>
      </div>

      {sms.attemptsLeft === 0 && (
        <div className="bg-[#fdecea] border border-[#f5c2c0] rounded-control p-3 text-xs text-danger">
          Попытки исчерпаны. Отправьте код повторно или обратитесь в{' '}
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
        disabled={sms.isLoading || sms.code.length !== 4 || sms.attemptsLeft === 0}
      >
        {sms.isLoading ? 'Проверяем…' : 'Войти'}
      </Button>
    </form>
  )
}
