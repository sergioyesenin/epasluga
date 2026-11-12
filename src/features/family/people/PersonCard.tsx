import clsx from 'clsx'
import { Icon, Switch } from '../../../design-system'
import type { DalonPerson } from '../../../types/dalon'
import { formatDay } from '../../../lib/dates'
import { cancelRequest, setConsent, setRole } from '../../../lib/dalon/actions'
import { showToast } from '../../../lib/toast'
import { MemberAvatar } from '../components/MemberAvatar'
import { dangerTextButton, quietButton, textButton } from '../components/styles'

function ConsentPill({ person }: { person: DalonPerson }) {
  if (person.consent === 'given') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-ok-tint text-ok px-2.5 py-1 text-xs font-semibold">
        <Icon name="check" className="w-3.5 h-3.5" strokeWidth={2.4} />
        Согласие дано {formatDay(person.consentAt)}
      </span>
    )
  }
  if (person.consent === 'pending') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-warn-tint text-warn px-2.5 py-1 text-xs font-semibold">
        <Icon name="clock" className="w-3.5 h-3.5" />
        Ожидает согласия
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-soft text-muted px-2.5 py-1 text-xs font-semibold">
      <Icon name="close" className="w-3.5 h-3.5" />
      Согласие отозвано
    </span>
  )
}

function initialsOf(full: string): string {
  return full
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
}

type PersonCardProps = {
  person: DalonPerson
  onRevoke: (person: DalonPerson) => void
}

/** Взрослый с ролями «видит» / «платит» и статусом согласия. */
export function PersonCard({ person, onRevoke }: PersonCardProps) {
  const off = person.consent === 'revoked'

  return (
    <article
      className={clsx('bg-card border border-line rounded-card p-4 md:p-5', off && 'bg-soft/50')}
    >
      <header className="flex flex-wrap items-start gap-3">
        <MemberAvatar kind="adult" initials={initialsOf(person.full)} size="md" />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-ink leading-snug">{person.full}</h3>
          <p className="text-sm text-muted">{person.relation}</p>
        </div>
        <ConsentPill person={person} />
      </header>

      <div className="mt-3 grid sm:grid-cols-2 gap-x-6">
        <Switch
          tone="family"
          checked={person.sees}
          disabled={off}
          label="Видит"
          hint="начисления и сроки семьи"
          onChange={(v) => {
            setRole(person.id, 'sees', v)
            showToast({
              id: 'role',
              tone: 'ok',
              message: `${person.name}: «видит» — ${v ? 'включено' : 'выключено'}`,
            })
          }}
        />
        <Switch
          tone="family"
          checked={person.pays}
          disabled={off}
          label="Платит"
          hint="может оплачивать за семью"
          onChange={(v) => {
            setRole(person.id, 'pays', v)
            showToast({
              id: 'role',
              tone: 'ok',
              message: `${person.name}: «платит» — ${v ? 'включено' : 'выключено'}`,
            })
          }}
        />
      </div>

      {person.consent === 'pending' && (
        <p className="mt-2 text-sm text-muted">
          Запрос ушёл в кабинет Е-Паслуги. Доступ появится только после согласия.
        </p>
      )}
      {off && (
        <p className="mt-2 text-sm text-muted">
          Доступа нет. Начисления этого человека в «Далони» не показываются, история платежей
          сохранена.
        </p>
      )}

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
        {person.consent === 'given' && (
          <button
            type="button"
            className={dangerTextButton}
            onClick={() => {
              onRevoke(person)
            }}
          >
            Отозвать доступ
          </button>
        )}
        {person.consent === 'pending' && (
          <>
            <button
              type="button"
              className={`${quietButton} text-sm`}
              onClick={() => {
                setConsent(person.id, 'given')
                showToast({ tone: 'ok', message: `${person.name}: согласие получено` })
              }}
            >
              Демо: {person.name} соглашается
            </button>
            <button
              type="button"
              className={textButton}
              onClick={() => {
                cancelRequest(person.id)
                showToast({ message: 'Запрос отменён' })
              }}
            >
              Отменить запрос
            </button>
          </>
        )}
        {off && (
          <button
            type="button"
            className={`${quietButton} text-sm`}
            onClick={() => {
              setConsent(person.id, 'pending')
              showToast({ tone: 'ok', message: `Запрос отправлен: ${person.name}` })
            }}
          >
            Отправить запрос снова
          </button>
        )}
      </div>
    </article>
  )
}
