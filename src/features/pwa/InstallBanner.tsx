import clsx from 'clsx'
import { AppMark, Icon } from '../../design-system'
import { useInstallPrompt } from '../../hooks/useInstallPrompt'
import { showToast } from '../../lib/toast'

function IosSteps() {
  return (
    <ol className="mt-3 space-y-2 text-sm text-ink">
      <li className="flex items-center gap-2.5">
        <span className="w-6 h-6 rounded-full bg-soft text-muted text-xs font-semibold inline-flex items-center justify-center shrink-0">
          1
        </span>
        <span>
          Нажмите «Поделиться»{' '}
          <Icon
            name="share"
            className="inline w-4.5 h-4.5 -mt-1 text-navy"
            title="значок «Поделиться»"
          />{' '}
          в панели Safari
        </span>
      </li>
      <li className="flex items-center gap-2.5">
        <span className="w-6 h-6 rounded-full bg-soft text-muted text-xs font-semibold inline-flex items-center justify-center shrink-0">
          2
        </span>
        <span>
          Выберите «На экран „Домой“»{' '}
          <Icon
            name="addSquare"
            className="inline w-4.5 h-4.5 -mt-1 text-navy"
            title="значок «На экран Домой»"
          />
        </span>
      </li>
      <li className="flex items-center gap-2.5">
        <span className="w-6 h-6 rounded-full bg-soft text-muted text-xs font-semibold inline-flex items-center justify-center shrink-0">
          3
        </span>
        <span>Нажмите «Добавить» — значок появится рядом с другими приложениями</span>
      </li>
    </ol>
  )
}

type InstallBannerProps = {
  className?: string
}

/**
 * «Установить приложение»: системное окно на Android/Chrome,
 * инструкция на iPhone. В установленном приложении не показывается.
 */
export function InstallBanner({ className }: InstallBannerProps) {
  const { mode, install, dismiss } = useInstallPrompt()

  if (mode === 'none') {
    return null
  }

  const handleInstall = async () => {
    const outcome = await install()
    if (outcome === 'accepted') {
      showToast({ tone: 'ok', message: 'Е-Паслуга установлена — ищите значок на экране «Домой».' })
    }
  }

  return (
    <section
      aria-labelledby="install-title"
      className={clsx(
        'relative bg-card border border-line rounded-card p-4 pr-14 md:p-5 md:pr-14 flex gap-4 items-start',
        className,
      )}
    >
      <AppMark className="w-12 h-12 shrink-0 rounded-xl shadow-sm" />
      <div className="min-w-0 flex-1">
        <h2 id="install-title" className="font-semibold text-ink leading-snug">
          {mode === 'ios'
            ? 'Е-Паслуга на iPhone — без App Store'
            : 'Установите Е-Паслугу на устройство'}
        </h2>
        <p className="text-sm text-muted mt-0.5">
          Открывается с экрана «Домой», работает без сети и напоминает о сроках платежей.
        </p>
        {mode === 'ios' ? (
          <IosSteps />
        ) : (
          <button
            type="button"
            onClick={() => {
              void handleInstall()
            }}
            className="mt-3 inline-flex items-center gap-2 min-h-11 px-4 whitespace-nowrap rounded-control bg-navy text-white text-sm font-semibold hover:bg-navy-deep transition-colors"
          >
            <Icon name="download" className="w-4.5 h-4.5" />
            Установить
          </button>
        )}
      </div>
      <button
        type="button"
        onClick={dismiss}
        className="absolute top-2 right-2 w-11 h-11 inline-flex items-center justify-center rounded-xl text-muted hover:text-ink hover:bg-soft"
        aria-label="Скрыть предложение установить приложение"
      >
        <Icon name="close" className="w-4.5 h-4.5" />
      </button>
    </section>
  )
}
