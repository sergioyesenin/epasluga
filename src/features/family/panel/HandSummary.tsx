import clsx from 'clsx'
import type { DalonCharge, DalonMember, Finger } from '../../../types/dalon'
import { DALON_MEMBERS } from '../../../data/dalon'
import { formatBYN, formatMoney } from '../../../lib/money'
import { countText } from '../../../lib/dates'
import { sumDue } from '../../../lib/dalon/selectors'
import { MemberAvatar } from '../components/MemberAvatar'

/** Высота пальца — как у настоящей ладони: средний длиннее всех, мизинец короче. */
const FINGER_CLASS: Record<Finger, string> = {
  // На телефоне без наклона: повёрнутый палец уезжал за край экрана и под ладонь
  thumb: 'h-[74%] sm:h-[66%] sm:-rotate-[14deg] origin-bottom-right sm:mr-3',
  index: 'h-[88%]',
  middle: 'h-full',
  ring: 'h-[92%]',
  pinky: 'h-[72%]',
}

type FingerProps = {
  member: DalonMember
  charges: DalonCharge[]
  hidden: boolean
  now: Date
  onPick: (memberId: string) => void
}

function FingerButton({ member, charges, hidden, now, onPick }: FingerProps) {
  const sum = sumDue(charges, now)
  let sumText = 'оплачено'
  let aria = `${member.name}: всё оплачено`
  if (hidden) {
    sumText = 'нет доступа'
    aria = `${member.name}: нет доступа, согласие не дано`
  } else if (charges.length > 0) {
    sumText = formatMoney(sum)
    aria = `${member.name}: ${countText(charges.length, 'начисление', 'начисления', 'начислений')} на ${formatBYN(sum)}`
  }

  return (
    <button
      type="button"
      onClick={() => {
        onPick(member.id)
      }}
      aria-label={aria}
      className={clsx(
        'relative flex-1 min-w-0 rounded-t-full bg-family-hand hover:bg-family-hand-hover transition-colors',
        'focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-family-wine',
        FINGER_CLASS[member.finger],
      )}
    >
      <span
        className={clsx(
          'flex flex-col items-center gap-1 pt-2.5 sm:pt-4 px-0.5',
          member.finger === 'thumb' && 'sm:rotate-[14deg]',
        )}
      >
        <MemberAvatar
          kind={member.kind}
          initials={member.initials}
          size="md"
          className="ring-2 ring-white/70"
        />
        <span className="text-[13px] sm:text-[15px] font-semibold text-ink leading-tight">
          {member.name}
        </span>
        <span
          className={clsx(
            'text-[12px] sm:text-sm leading-tight tabular text-center',
            charges.length > 0 && !hidden ? 'font-bold text-family-wine' : 'text-muted',
          )}
        >
          {sumText}
        </span>
      </span>
    </button>
  )
}

type HandSummaryProps = {
  charges: DalonCharge[]
  total: number
  now: Date
  isHidden: (memberId: DalonMember['id']) => boolean
  onPick: (memberId: string) => void
}

/**
 * Ладонь: пять пальцев — пять членов семьи (вместе с автомобилем),
 * на ладони — сколько всего к оплате. Нажатие на палец ведёт к его начислениям.
 */
export function HandSummary({ charges, total, now, isHidden, onPick }: HandSummaryProps) {
  return (
    <section aria-labelledby="hand-title" className="w-full max-w-[560px]">
      <h2 id="hand-title" className="sr-only">
        Семья и сумма к оплате
      </h2>
      <div className="flex items-end gap-1.5 sm:gap-2.5 h-52 sm:h-60 pl-1 pr-4 sm:pr-6">
        {DALON_MEMBERS.map((m) => (
          <FingerButton
            key={m.id}
            member={m}
            charges={charges.filter((c) => c.memberId === m.id)}
            hidden={isHidden(m.id)}
            now={now}
            onPick={onPick}
          />
        ))}
      </div>
      <div className="relative z-10 -mt-5 sm:-mt-7 rounded-t-[28px] rounded-b-[56px] bg-family-hand px-6 sm:px-8 pt-6 pb-8">
        <p className="text-[15px] text-muted">К оплате у семьи</p>
        <p className="mt-1 leading-none">
          <span className="tabular text-[40px] sm:text-[48px] font-bold tracking-tight text-family-wine">
            {formatMoney(total)}
          </span>
          <span className="ml-2 text-xl font-semibold text-muted">BYN</span>
        </p>
        <p className="mt-2 text-[15px] text-muted">
          {charges.length > 0
            ? countText(charges.length, 'начисление', 'начисления', 'начислений')
            : 'Начислений нет'}
        </p>
      </div>
    </section>
  )
}
