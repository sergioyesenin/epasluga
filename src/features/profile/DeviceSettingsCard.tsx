import { Card, Switch } from '../../design-system'
import { useBiometric } from '../../hooks/useBiometric'
import { useStandalone } from '../../hooks/useStandalone'
import { formatDay } from '../../lib/dates'
import { showToast } from '../../lib/toast'
import { InstallBanner } from '../pwa/InstallBanner'

/** «Вход на этом устройстве»: биометрия и установка приложения. */
export function DeviceSettingsCard() {
  const bio = useBiometric()
  const standalone = useStandalone()

  let hint = 'Без SMS: телефон сам проверит отпечаток или лицо'
  if (bio.available === false) {
    hint = 'На этом устройстве нет сканера отпечатка или Face ID (или страница открыта не по HTTPS)'
  } else if (bio.enrollment) {
    hint = `Включено ${formatDay(bio.enrollment.enabledAt)}. Отпечаток и лицо не покидают устройство`
  }

  return (
    <Card>
      <h3 className="text-lg font-bold text-ink mb-2 border-b border-line pb-2">
        Вход на этом устройстве
      </h3>
      <Switch
        checked={bio.enrolled}
        disabled={bio.available === false && !bio.enrolled}
        label="Входить по отпечатку или Face ID"
        hint={hint}
        onChange={(v) => {
          if (v) {
            bio.enable()
            showToast({ tone: 'ok', message: 'Быстрый вход включён на этом устройстве' })
          } else {
            bio.disable()
            showToast({ message: 'Быстрый вход выключен — входите по SMS или ЭЦП' })
          }
        }}
      />
      <p className="text-sm text-muted mt-2">
        {standalone
          ? 'Е-Паслуга запущена как приложение: работает без сети и присылает напоминания.'
          : 'Е-Паслугу можно установить как приложение — без магазина приложений.'}
      </p>
      <InstallBanner className="mt-3" />
    </Card>
  )
}
