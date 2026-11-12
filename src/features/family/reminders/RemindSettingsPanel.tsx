import type { ReactNode } from 'react'
import { Switch } from '../../../design-system'
import type { RemindKey, RemindSettings } from '../../../types/dalon'
import { setRemind } from '../../../lib/dalon/actions'
import { showToast } from '../../../lib/toast'
import { usePushReminders } from '../../../hooks/usePushReminders'
import { FraudNote } from '../components/SafetyNotes'

type Option = { key: RemindKey; label: string; hint?: string }

const WHEN: Option[] = [
  { key: 'd7', label: 'За 7 дней до срока' },
  { key: 'd1', label: 'За день до срока' },
  { key: 'd0', label: 'В день срока' },
]

const WHAT: Option[] = [
  { key: 'tax', label: 'Налоги' },
  { key: 'fine', label: 'Штрафы ГАИ и техосмотр' },
  { key: 'kids', label: 'Садик и кружки' },
  { key: 'home', label: 'ЖКХ и связь' },
  { key: 'doc', label: 'Сроки документов' },
]

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="py-3 border-t border-line first-of-type:border-t-0 first-of-type:pt-0">
      <legend className="sr-only">{title}</legend>
      <p className="text-sm font-semibold text-muted mb-1" aria-hidden="true">
        {title}
      </p>
      {children}
    </fieldset>
  )
}

/** Настройки: когда, куда и о чём напоминать. */
export function RemindSettingsPanel({ remind }: { remind: RemindSettings }) {
  const push = usePushReminders()

  const save = (key: RemindKey, value: boolean) => {
    setRemind(key, value)
    showToast({ id: 'remind-saved', tone: 'ok', message: 'Настройки напоминаний сохранены' })
  }

  const renderSwitch = (o: Option) => (
    <Switch
      key={o.key}
      tone="family"
      checked={remind[o.key]}
      label={o.label}
      hint={o.hint}
      onChange={(v) => {
        save(o.key, v)
      }}
    />
  )

  return (
    <aside
      aria-labelledby="remind-settings-title"
      className="bg-card border border-line rounded-card p-5 lg:sticky lg:top-24"
    >
      <h2 id="remind-settings-title" className="text-lg font-bold text-ink mb-3">
        Как напоминать
      </h2>
      <Group title="Когда">{WHEN.map(renderSwitch)}</Group>
      <Group title="Куда">
        <Switch
          tone="family"
          checked
          disabled
          label="В кабинет Е-Паслуги"
          hint="Всегда включено"
          onChange={() => undefined}
        />
        <Switch
          tone="family"
          checked={push.enabled}
          disabled={push.iosNeedsInstall || push.permission === 'unsupported'}
          label="Push в приложении «Е-Паслуга»"
          hint={
            push.permission === 'denied'
              ? 'Запрещено в настройках браузера'
              : push.iosNeedsInstall
                ? 'На iPhone — после установки на экран «Домой»'
                : 'Разрешение спросим при включении'
          }
          onChange={(v) => {
            if (v) {
              void push.enable()
            } else {
              push.disable()
              showToast({ id: 'remind-saved', tone: 'ok', message: 'Push-напоминания выключены' })
            }
          }}
        />
        {renderSwitch({ key: 'sms', label: 'SMS', hint: 'На +375 29 555-12-34' })}
        {renderSwitch({ key: 'email', label: 'Электронная почта', hint: 'a.ivanov@example.by' })}
      </Group>
      <Group title="О чём">{WHAT.map(renderSwitch)}</Group>
      <FraudNote className="mt-3" />
    </aside>
  )
}
