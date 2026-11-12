import { Link } from 'react-router-dom'
import { Icon } from '../../../design-system'
import type { DalonCharge, DalonMember } from '../../../types/dalon'
import { formatBYN } from '../../../lib/money'
import { sumDue } from '../../../lib/dalon/selectors'
import { MemberAvatar } from '../components/MemberAvatar'
import { ChargeRow } from './ChargeRow'

type MemberGroupProps = {
  member: DalonMember
  charges: DalonCharge[]
  hidden: boolean
  selected: string[]
  now: Date
  onToggle: (id: string) => void
}

/** Начисления одного члена семьи. id нужен, чтобы палец ладони прокручивал сюда. */
export function MemberGroup({ member, charges, hidden, selected, now, onToggle }: MemberGroupProps) {
  return (
    <section
      id={`member-${member.id}`}
      tabIndex={-1}
      aria-labelledby={`member-${member.id}-title`}
      className="bg-card border border-line rounded-card overflow-hidden scroll-mt-24 focus:outline-3 focus:outline-family-wine/40"
    >
      <header className="flex items-center gap-3 px-4 py-3 border-b border-line">
        <MemberAvatar kind={member.kind} initials={member.initials} size="md" />
        <div className="flex-1 min-w-0">
          <h3 id={`member-${member.id}-title`} className="font-semibold text-ink leading-snug truncate">
            {member.full}
          </h3>
          <p className="text-sm text-muted">{member.role}</p>
        </div>
        {charges.length > 0 && !hidden && (
          <span className="tabular font-semibold text-family-wine whitespace-nowrap">
            {formatBYN(sumDue(charges, now))}
          </span>
        )}
      </header>

      {hidden ? (
        <p className="flex gap-3 px-4 py-4 text-sm text-muted">
          <Icon name="lock" className="w-5 h-5 shrink-0" />
          <span>
            Начисления скрыты: согласия на доступ нет или оно отозвано.{' '}
            <Link to="/family/people" className="font-semibold text-family-wine underline underline-offset-2">
              Семья и права
            </Link>
          </span>
        </p>
      ) : charges.length === 0 ? (
        <p className="flex gap-3 px-4 py-4 text-sm text-muted">
          <Icon name="check" className="w-5 h-5 shrink-0 text-ok" />
          Начислений нет — всё оплачено.
        </p>
      ) : (
        <ul className="divide-y divide-line">
          {charges.map((c) => (
            <ChargeRow
              key={c.id}
              charge={c}
              checked={selected.includes(c.id)}
              now={now}
              onToggle={onToggle}
            />
          ))}
        </ul>
      )}
    </section>
  )
}
