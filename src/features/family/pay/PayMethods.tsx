import clsx from 'clsx'
import { Icon, type IconName } from '../../../design-system'
import type { PayMethod } from '../../../types/dalon'

const METHODS: Array<{ id: PayMethod; title: string; text: string; icon: IconName }> = [
  {
    id: 'erip',
    title: 'ЕРИП через ваш интернет-банк',
    text: 'Откроется ваш банк с уже заполненным платежом. Номер услуги и реквизиты вводить не нужно.',
    icon: 'bank',
  },
  {
    id: 'card',
    title: 'Банковская карта',
    text: 'Белкарт, Visa, Mastercard, МИР. Данные карты вводятся на странице банка, а не в Е-Паслуге.',
    icon: 'card',
  },
]

type PayMethodsProps = {
  value: PayMethod
  onChange: (m: PayMethod) => void
  disabled: boolean
}

export function PayMethods({ value, onChange, disabled }: PayMethodsProps) {
  return (
    <fieldset disabled={disabled} className="space-y-2">
      <legend className="font-semibold text-ink mb-2">Способ оплаты</legend>
      {METHODS.map((m) => {
        const on = value === m.id
        return (
          <label
            key={m.id}
            className={clsx(
              'flex items-start gap-3 rounded-xl border px-4 py-3.5 cursor-pointer transition-colors',
              on
                ? 'border-family-wine bg-family-wine-tint/40'
                : 'border-line bg-card hover:border-line-2',
            )}
          >
            <input
              type="radio"
              name="pay-method"
              value={m.id}
              checked={on}
              onChange={() => {
                onChange(m.id)
              }}
              className="mt-1 w-5 h-5 accent-family-wine shrink-0"
            />
            <Icon
              name={m.icon}
              className={clsx('w-6 h-6 shrink-0', on ? 'text-family-wine' : 'text-muted')}
            />
            <span>
              <span className="block font-semibold text-ink">{m.title}</span>
              <span className="block text-sm text-muted">{m.text}</span>
            </span>
          </label>
        )
      })}
    </fieldset>
  )
}
