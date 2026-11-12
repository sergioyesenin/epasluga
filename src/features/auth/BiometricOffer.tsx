import { Button, Icon } from '../../design-system'

type Props = {
  onEnable: () => void
  onSkip: () => void
}

/** После первого входа по SMS: предложить быстрый вход на этом устройстве. */
export function BiometricOffer({ onEnable, onSkip }: Props) {
  return (
    <div className="text-center space-y-5">
      <span className="mx-auto w-16 h-16 rounded-full bg-navy-tint text-navy inline-flex items-center justify-center">
        <Icon name="fingerprint" className="w-8 h-8" />
      </span>
      <div>
        <h2 className="text-xl font-bold text-ink">Входить по отпечатку или Face ID?</h2>
        <p className="text-sm text-muted mt-2">
          В следующий раз на этом устройстве не понадобится SMS. Отпечаток и лицо не покидают телефон —
          Е-Паслуга получает только подтверждение, что это вы.
        </p>
      </div>
      <div className="space-y-2">
        <Button type="button" className="w-full h-12 text-base gap-2" onClick={onEnable}>
          <Icon name="fingerprint" className="w-5 h-5" />
          Включить быстрый вход
        </Button>
        <Button type="button" variant="ghost" className="w-full h-11" onClick={onSkip}>
          Не сейчас
        </Button>
      </div>
      <p className="text-xs text-muted">Отключить можно в кабинете: «Данные» → «Вход на этом устройстве».</p>
    </div>
  )
}
