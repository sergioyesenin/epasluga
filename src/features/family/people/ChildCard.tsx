import { Icon } from '../../../design-system'
import type { DalonPerson } from '../../../types/dalon'
import { adulthoodDate, personAccess, personRole } from '../../../lib/dalon/selectors'
import { formatDate } from '../../../lib/dates'
import { MemberAvatar } from '../components/MemberAvatar'
import { LinkPill } from './LinkPill'
import { ZagsRecordLine } from './ZagsRecordLine'

type ChildCardProps = {
  child: DalonPerson
  /** «вы и Анна» — законные представители. */
  parents: string
  now: Date
}

/** Ребёнок: запись о рождении, где учится, до какого дня действует законное представительство. */
export function ChildCard({ child, parents, now }: ChildCardProps) {
  const access = personAccess(child, now)
  const until = formatDate(adulthoodDate(child.birth))
  const place = child.school
    ? `${child.school.name}, ${child.school.grade} класс`
    : child.kindergarten

  return (
    <article
      className={
        access === 'open'
          ? 'bg-card border border-line rounded-card p-4'
          : 'bg-soft/50 border border-line rounded-card p-4'
      }
    >
      <header className="flex gap-3">
        <MemberAvatar kind="child" initials={child.initials} size="md" />
        <div className="min-w-0">
          <h3 className="font-semibold text-ink leading-snug">{child.full}</h3>
          <p className="text-sm text-muted">{personRole(child, now)}</p>
          {place && <p className="text-sm text-muted">{place}</p>}
          <LinkPill
            closed={access !== 'open'}
            text={access === 'adult' ? 'Совершеннолетие: нет доступа' : undefined}
          />
        </div>
      </header>

      {child.basis && <ZagsRecordLine record={child.basis} variant="basis" className="mt-3" />}

      {access === 'closed' && child.closedBy && (
        <ZagsRecordLine record={child.closedBy} variant="closed" className="mt-2" />
      )}

      {access === 'open' && (
        <ul className="mt-3 space-y-1.5 text-xs text-muted">
          <li className="flex gap-2">
            <Icon name="shield" className="w-4 h-4 shrink-0" />
            Законные представители: {parents}
          </li>
          <li className="flex gap-2">
            <Icon name="clock" className="w-4 h-4 shrink-0" />
            Представительство прекратится само в 18 лет — {until}. Тогда{' '}
            {child.relation === 'Сын' ? 'его' : 'её'} начисления уйдут из «Далони».
          </li>
        </ul>
      )}

      {access === 'adult' && (
        <p className="mt-3 text-sm text-muted">
          С {until} — совершеннолетие: законное представительство прекратилось автоматически,
          начисления больше не показываются. Связь по записи о рождении остаётся.
        </p>
      )}
    </article>
  )
}
