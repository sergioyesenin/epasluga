import clsx from 'clsx'
import { Icon } from '../../../design-system'

/** Главный текст антифрода — одинаковый везде, где о нём говорим. */
export const FRAUD_TEXT =
  'Мы никогда не присылаем ссылки на оплату и не просим коды из SMS — оплата только внутри приложения.'

/** Плашка антифрода: мошенники пишут от имени Е-Паслуги и присылают «ссылку на оплату». */
export function FraudNote({ className }: { className?: string }) {
  return (
    <p
      className={clsx(
        'flex gap-3 rounded-xl border border-family-wine/20 bg-family-wine-tint px-4 py-3 text-sm text-family-wine-ink',
        className,
      )}
    >
      <Icon name="shield" className="w-5 h-5 shrink-0 mt-px" />
      <span>
        <span className="font-semibold">{FRAUD_TEXT}</span> Сообщение со ссылкой «оплатить штраф» —
        признак мошенников: не открывайте её.
      </span>
    </p>
  )
}

/** «Деньги не хранятся в Е-Паслуге» — отличие от кошелька, снимает страх «спишут лишнее». */
export function NoWalletNote({ className }: { className?: string }) {
  return (
    <p className={clsx('flex gap-3 text-sm text-muted', className)}>
      <Icon name="lock" className="w-5 h-5 shrink-0 mt-px" />
      <span>
        Деньги не хранятся в Е-Паслуге: здесь нет баланса и кошелька. Платёж проводит ваш банк через
        ЕРИП, и только после вашего подтверждения.
      </span>
    </p>
  )
}
