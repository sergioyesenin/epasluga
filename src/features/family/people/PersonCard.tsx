import clsx from 'clsx'
import { Icon, Switch } from '../../../design-system'
import type { DalonPerson } from '../../../types/dalon'
import { setPays } from '../../../lib/dalon/actions'
import { showToast } from '../../../lib/toast'
import { MemberAvatar } from '../components/MemberAvatar'
import { LinkPill } from './LinkPill'
import { ZagsRecordLine } from './ZagsRecordLine'

/** Права взрослого: «видит» даёт связь ЗАГС, «платит» включают сами супруги. */
function Rights({ person }: { person: DalonPerson }) {
  return (
    <div className="mt-3 grid sm:grid-cols-2 gap-x-6 border-t border-line pt-2">
      <p className="flex items-start gap-3 min-h-11 py-2">
        <span className="mt-0.5 w-10 h-6 shrink-0 rounded-full bg-family-wine-tint text-family-wine inline-flex items-center justify-center">
          <Icon name="check" className="w-4 h-4" strokeWidth={2.4} />
        </span>
        <span className="flex flex-col">
          <span className="text-[15px] text-ink leading-snug">Видит</span>
          <span className="text-xs text-muted mt-0.5">
            начисления и сроки семьи — пока действует запись о браке
          </span>
        </span>
      </p>
      <Switch
        tone="family"
        checked={person.pays}
        label="Платит"
        hint={`может оплачивать за семью — ${person.name} включает и выключает сама`}
        onChange={(v) => {
          setPays(person.id, v)
          showToast({
            id: 'role',
            tone: 'ok',
            message: `${person.name}: «платит» — ${v ? 'включено' : 'выключено'}`,
          })
        }}
      />
    </div>
  )
}

/** Взрослый в семье: связь по записи о браке, права, а если связь закрыта — чем. */
export function PersonCard({ person }: { person: DalonPerson }) {
  const closed = Boolean(person.closedBy)

  return (
    <article
      className={clsx(
        'border border-line rounded-card p-4 md:p-5',
        closed ? 'bg-soft/50' : 'bg-card',
      )}
    >
      <header className="flex items-start gap-3">
        <MemberAvatar kind="adult" initials={person.initials} size="md" />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-ink leading-snug">{person.full}</h3>
          <p className="text-sm text-muted mb-2">{person.relation}</p>
          <LinkPill closed={closed} />
        </div>
      </header>

      {person.basis && <ZagsRecordLine record={person.basis} variant="basis" className="mt-3" />}

      {person.closedBy ? (
        <>
          <ZagsRecordLine record={person.closedBy} variant="closed" className="mt-2" />
          <p className="mt-2 text-sm text-muted">
            Доступа нет: начисления не показываются, «видит» и «платит» выключены. История платежей
            сохранена.
          </p>
        </>
      ) : (
        <Rights person={person} />
      )}
    </article>
  )
}
