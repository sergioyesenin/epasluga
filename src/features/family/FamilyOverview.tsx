import { useMemo } from 'react'
import type { FamilyMember } from '../../types/service'
import { family, formatBYN, totalDue, STEM_TO_FLOWER_THRESHOLD } from '../../data/family'

type MemberPinProps = {
  member: FamilyMember
  x: number
  y: number
  selected: boolean
  onSelect: (id: string) => void
}

function MemberPin({ member, x, y, selected, onSelect }: MemberPinProps) {
  const isPaid = member.status === 'paid'
  const due = Math.max(0, member.dueAmount - member.paidAmount)
  const tint = `var(--color-family-${member.avatarTint.replace('tint-', '')})`
  const tintInk = `var(--color-family-${member.avatarTint.replace('tint-', '')}-ink)`

  return (
    <button
      type="button"
      className={`family-pin absolute flex flex-col items-center gap-0.5 px-2 py-1 -m-1 transition-colors ${
        selected ? 'bg-family-wine-tint rounded-2xl' : ''
      }`}
      style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
      onClick={() => onSelect(member.id)}
      aria-pressed={selected}
      aria-label={`${member.name}, ${isPaid ? 'оплачено' : `к оплате ${formatBYN(due)}`}`}
    >
      <span
        className="flex items-center justify-center w-10 h-10 rounded-full text-[12px] font-bold shadow-sm"
        style={{
          background: isPaid ? 'var(--color-family-sand)' : tint,
          color: isPaid ? 'var(--color-family-sand-ink)' : tintInk,
          opacity: isPaid ? 0.7 : 1,
          boxShadow: selected ? '0 0 0 2px var(--color-family-wine)' : undefined,
        }}
        aria-hidden="true"
      >
        {member.initials}
      </span>
      <span className="text-[12px] font-semibold text-navy-deep leading-tight">
        {member.name.split(' ')[0]}
      </span>
      <span
        className="tabular text-[11px] leading-none text-center"
        style={{
          color: isPaid ? 'var(--color-muted)' : 'var(--color-family-wine)',
          fontWeight: isPaid ? 500 : 700,
          maxWidth: 80,
        }}
      >
        {isPaid ? 'оплачено' : formatBYN(due)}
      </span>
    </button>
  )
}

function Sprout({
  members,
  selectedId,
  onSelect,
}: {
  members: FamilyMember[]
  selectedId: string | null
  onSelect: (id: string) => void
}) {
  const total = totalDue(members)
  const slots = [
    { x: 30, y: 35 },
    { x: 70, y: 50 },
    { x: 30, y: 65 },
    { x: 70, y: 80 },
  ]

  return (
    <div className="relative w-full max-w-105 mx-auto aspect-3/4">
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
      >
        <path
          className="family-stem-path"
          d="M 50 96 Q 50 55 50 12"
          fill="none"
          stroke="var(--color-family-wine)"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.6"
        />
        {members.map((_, i) => {
          const slot = slots[i % slots.length]
          const flip = slot.x < 50
          return (
            <path
              key={i}
              d={
                flip
                  ? `M 50 ${slot.y} Q 30 ${slot.y - 6} ${slot.x} ${slot.y + 2} Q 40 ${slot.y + 6} 50 ${slot.y}`
                  : `M 50 ${slot.y} Q 70 ${slot.y - 6} ${slot.x} ${slot.y + 2} Q 60 ${slot.y + 6} 50 ${slot.y}`
              }
              fill="var(--color-family-sand)"
              stroke="var(--color-family-sand-ink)"
              strokeWidth="0.6"
              opacity="0.9"
            />
          )
        })}
        <ellipse cx="50" cy="96" rx="18" ry="2.2" fill="var(--color-family-sand)" />
      </svg>

      {members.map((m, i) => {
        const slot = slots[i % slots.length]
        return (
          <MemberPin
            key={m.id}
            member={m}
            x={slot.x}
            y={slot.y}
            selected={selectedId === m.id}
            onSelect={onSelect}
          />
        )
      })}

      <div className="absolute left-1/2 -translate-x-1/2 bottom-0 flex flex-col items-center pb-2">
        <span className="text-[12.5px] text-muted">К оплате у семьи</span>
        <span
          className="tabular text-[clamp(28px,5vw,40px)] font-bold leading-none"
          style={{ color: 'var(--color-family-wine)' }}
        >
          {formatBYN(total)}
        </span>
      </div>
    </div>
  )
}

function Flower({
  members,
  selectedId,
  onSelect,
}: {
  members: FamilyMember[]
  selectedId: string | null
  onSelect: (id: string) => void
}) {
  const total = totalDue(members)
  const n = members.length
  const cx = 50
  const cy = 50
  const R_base = 14
  const petalW = n <= 6 ? 16 : 13
  const petalH = n <= 6 ? 20 : 17
  const R_tip = R_base + petalH

  const positions = useMemo(
    () =>
      members.map((_, i) => {
        const angle = -Math.PI / 2 + (i * 2 * Math.PI) / n
        return {
          x: cx + R_tip * Math.cos(angle),
          y: cy + R_tip * Math.sin(angle),
          baseX: cx + R_base * Math.cos(angle),
          baseY: cy + R_base * Math.sin(angle),
          angleDeg: (angle * 180) / Math.PI,
        }
      }),
    [members, n, R_base, R_tip, cx, cy],
  )

  return (
    <div className="relative w-full max-w-140 mx-auto aspect-square">
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
      >
        {positions.map((p, i) => {
          const m = members[i]
          const paid = m.status === 'paid'
          const w = petalW / 2
          const h = petalH
          const d = `M 0 0 C -${w * 1.05} -${h * 0.15}, -${w * 1.25} -${h * 0.65}, 0 -${h} C ${w * 1.25} -${h * 0.65}, ${w * 1.05} -${h * 0.15}, 0 0 Z`
          return (
            <g
              key={i}
              transform={`translate(${p.baseX} ${p.baseY}) rotate(${p.angleDeg})`}
            >
              <path
                d={d}
                fill={paid ? 'var(--color-family-sand)' : 'var(--color-family-wine-tint)'}
                stroke={paid ? 'var(--color-family-sand-ink)' : 'var(--color-family-wine)'}
                strokeWidth={paid ? 0.45 : 0.9}
              />
            </g>
          )
        })}
        <circle
          cx={cx}
          cy={cy}
          r={R_base}
          fill="var(--color-family-wine-tint)"
          stroke="var(--color-family-wine)"
          strokeWidth="0.6"
        />
      </svg>

      {positions.map((p, i) => (
        <MemberPin
          key={members[i].id}
          member={members[i]}
          x={p.x}
          y={p.y}
          selected={selectedId === members[i].id}
          onSelect={onSelect}
        />
      ))}

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none">
        <span className="text-[10px] uppercase tracking-wider text-family-wine-ink font-semibold">
          К оплате
        </span>
        <span
          className="tabular text-[clamp(14px,2.5vw,20px)] font-bold leading-none"
          style={{ color: 'var(--color-family-wine)' }}
        >
          {formatBYN(total)}
        </span>
      </div>
    </div>
  )
}

export type FamilyOverviewProps = {
  members?: FamilyMember[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export function FamilyOverview({
  members = family,
  selectedId,
  onSelect,
}: FamilyOverviewProps) {
  const isFlower = members.length >= STEM_TO_FLOWER_THRESHOLD
  return (
    <div
      className="family-flower"
      data-dim={selectedId ? 'true' : 'false'}
      role="group"
      aria-label={`Семья: ${members.length} человек, к оплате ${formatBYN(totalDue(members))}`}
    >
      {isFlower ? (
        <Flower members={members} selectedId={selectedId} onSelect={onSelect} />
      ) : (
        <Sprout members={members} selectedId={selectedId} onSelect={onSelect} />
      )}

      {isFlower ? (
        <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-[12.5px] text-muted">
          <span className="inline-flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: 'var(--color-family-wine)' }}
              aria-hidden="true"
            />
            Есть счёт к оплате
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: 'var(--color-family-sand)' }}
              aria-hidden="true"
            />
            Оплачено
          </span>
          <span>Клик по лепестку — фильтр</span>
        </div>
      ) : (
        <p className="mt-3 text-center text-[12.5px] text-muted">
          Росток растёт вместе с семьёй. Начиная с 5 человек — расцветает.
        </p>
      )}
    </div>
  )
}