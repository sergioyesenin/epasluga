import { Icon } from '../../../design-system'
import { usePushReminders } from '../../../hooks/usePushReminders'
import { actionButton, quietButton } from '../components/styles'

/**
 * Карточка push-напоминаний: включить (запрос разрешения по кнопке)
 * и проверить на примере ближайшего платежа.
 */
export function PushCard() {
  const { permission, enabled, iosNeedsInstall, enable, sendTest } = usePushReminders()

  let body
  if (iosNeedsInstall || permission === 'unsupported') {
    body = (
      <p className="text-sm text-muted">
        На iPhone уведомления приходят только от установленного приложения. Добавьте Е-Паслугу на
        экран «Домой» (Поделиться → На экран «Домой») и включите напоминания там.
      </p>
    )
  } else if (permission === 'denied') {
    body = (
      <p className="text-sm text-muted">
        Уведомления запрещены для этого сайта. Чтобы включить: значок замка слева от адреса →
        «Уведомления» → «Разрешить», затем обновите страницу.
      </p>
    )
  } else if (!enabled) {
    body = (
      <>
        <p className="text-sm text-muted">
          Напомним за неделю и за день до срока — даже когда приложение закрыто. Разрешение спросим
          только после нажатия.
        </p>
        <button
          type="button"
          className={`${actionButton} mt-3`}
          onClick={() => {
            void enable()
          }}
        >
          <Icon name="bell" className="w-5 h-5" />
          Включить напоминания
        </button>
      </>
    )
  } else {
    body = (
      <>
        <p className="text-sm text-muted">
          Напоминания включены. Проверьте, как выглядит уведомление о ближайшем платеже.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            className={actionButton}
            onClick={() => {
              sendTest()
            }}
          >
            Прислать пример
          </button>
          <button
            type="button"
            className={quietButton}
            onClick={() => {
              sendTest(10000)
            }}
          >
            Через 10 секунд
          </button>
        </div>
      </>
    )
  }

  return (
    <section aria-labelledby="push-title" className="bg-card border border-line rounded-card p-5">
      <h2 id="push-title" className="flex items-center gap-2 font-semibold text-ink mb-1">
        <Icon name="phone" className="w-5 h-5 text-family-wine" />
        Напоминания на телефон
      </h2>
      {body}
    </section>
  )
}
