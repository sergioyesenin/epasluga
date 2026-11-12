import clsx from 'clsx'
import { AppMark, Icon, type IconName } from '../../design-system'

type Row = {
  icon: IconName
  tone: string
  title: string
  text: string
  when: string
}

/** Что приходит в приложение: статусы заявлений, сроки платежей семьи, документы. */
const ROWS: Row[] = [
  {
    icon: 'check',
    tone: 'bg-ok-tint text-ok',
    title: 'Справка о доходах готова',
    text: 'Документ с ЭЦП уже в кабинете — можно скачать.',
    when: 'сейчас',
  },
  {
    icon: 'hand',
    tone: 'bg-family-wine-tint text-family-wine',
    title: 'Далонь: техосмотр Polo',
    text: 'Госпошлина 107,10 BYN — оплатить в приложении.',
    when: 'вчера',
  },
  {
    icon: 'clock',
    tone: 'bg-navy-tint text-navy',
    title: 'Паспорт: заявление на проверке',
    text: 'МВД ответит в течение 15 дней.',
    when: '2 дня назад',
  },
]

/** Правая часть первого экрана для гостя — живой пример уведомлений вместо абстрактной иконки. */
export function HeroPreview() {
  return (
    <div className="relative w-full max-w-sm" aria-hidden="true">
      <div className="flex items-center gap-2 mb-3 text-sm text-muted">
        <AppMark className="w-5 h-5" />
        Е-Паслуга
      </div>
      <ul className="space-y-2.5">
        {ROWS.map((r, i) => (
          <li
            key={r.title}
            className={clsx(
              'flex gap-3 bg-card border border-line rounded-2xl p-3.5 shadow-card',
              i === 1 && 'md:translate-x-4',
              i === 2 && 'opacity-80',
            )}
          >
            <span
              className={clsx(
                'w-9 h-9 rounded-full inline-flex items-center justify-center shrink-0',
                r.tone,
              )}
            >
              <Icon name={r.icon} className="w-5 h-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex justify-between gap-2">
                <span className="text-sm font-semibold text-ink leading-snug">{r.title}</span>
                <span className="text-xs text-muted whitespace-nowrap">{r.when}</span>
              </span>
              <span className="block text-sm text-muted leading-snug">{r.text}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
