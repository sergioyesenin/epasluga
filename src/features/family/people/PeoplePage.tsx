import { useState } from 'react'
import { ConfirmDialog, Icon } from '../../../design-system'
import type { DalonPerson } from '../../../types/dalon'
import { useDalon } from '../../../hooks/useDalon'
import { DALON_MEMBERS, memberById } from '../../../data/dalon'
import { setConsent } from '../../../lib/dalon/actions'
import { showToast } from '../../../lib/toast'
import { formatDay } from '../../../lib/dates'
import { MemberAvatar } from '../components/MemberAvatar'
import { TypeLabel } from '../components/TypeLabel'
import { actionButton } from '../components/styles'
import { AddPersonDialog } from './AddPersonDialog'
import { PersonCard } from './PersonCard'

const RULES = [
  {
    title: 'Взрослый — только с согласия.',
    text: 'Запрос уходит в его кабинет. Пока он не согласится, вы ничего о нём не видите.',
  },
  {
    title: 'Роли можно сочетать.',
    text: '«Видит» — начисления и сроки семьи. «Платит» — может оплатить за любого члена семьи.',
  },
  {
    title: 'Согласие отзывается в один клик.',
    text: 'Начисления человека сразу исчезают из «Далони», история платежей остаётся.',
  },
  {
    title: 'Дети — через законного представителя.',
    text: 'Согласие детей не нужно: садик, школу и кружки видят родители по данным регистра населения.',
  },
]

/** «Семья и права»: кто видит, кто платит, согласия, дети и имущество. */
export function PeoplePage() {
  const { state } = useDalon()
  const [adding, setAdding] = useState(false)
  const [revoking, setRevoking] = useState<DalonPerson | null>(null)
  const me = memberById('me')
  const kids = DALON_MEMBERS.filter((m) => m.kind === 'child')
  const car = memberById('car')

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-6 items-start">
      <div className="space-y-8 min-w-0">
        <section aria-labelledby="adults-title" className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id="adults-title" className="text-lg font-bold text-ink">
              Взрослые
            </h2>
            <button
              type="button"
              className={actionButton}
              onClick={() => {
                setAdding(true)
              }}
            >
              <Icon name="plus" className="w-5 h-5" />
              Добавить взрослого
            </button>
          </div>

          {me && (
            <article className="bg-card border border-line rounded-card p-4 md:p-5 flex flex-wrap items-center gap-3">
              <MemberAvatar kind="adult" initials={me.initials} size="md" />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-ink leading-snug">{me.full}</h3>
                <p className="text-sm text-muted">Вы — владелец семейного пространства</p>
              </div>
              <span className="rounded-full bg-family-wine-tint text-family-wine-ink px-2.5 py-1 text-xs font-semibold">
                Видит и платит
              </span>
            </article>
          )}

          {state.people.map((p) => (
            <PersonCard key={p.id} person={p} onRevoke={setRevoking} />
          ))}
        </section>

        <section aria-labelledby="kids-title" className="space-y-3">
          <h2 id="kids-title" className="text-lg font-bold text-ink">
            Дети
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {kids.map((k) => (
              <article key={k.id} className="bg-card border border-line rounded-card p-4 flex gap-3">
                <MemberAvatar kind="child" initials={k.initials} size="md" />
                <div className="min-w-0">
                  <h3 className="font-semibold text-ink leading-snug">{k.full}</h3>
                  <p className="text-sm text-muted">{k.role}</p>
                  <p className="mt-2 flex gap-2 text-xs text-muted">
                    <Icon name="shield" className="w-4 h-4 shrink-0" />
                    Законные представители: вы и Анна
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {car && (
          <section aria-labelledby="car-title" className="space-y-3">
            <h2 id="car-title" className="text-lg font-bold text-ink">
              Имущество
            </h2>
            <article className="bg-card border border-line rounded-card p-4 flex gap-3">
              <MemberAvatar kind="car" initials="" size="md" />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-ink leading-snug">{car.full}</h3>
                <p className="text-sm text-muted">{car.role}</p>
                <p className="mt-2 flex gap-2 text-xs text-muted">
                  <Icon name="info" className="w-4 h-4 shrink-0" />
                  Штрафы с камер и госпошлина за техосмотр приходят по номеру автомобиля сами.
                </p>
              </div>
              <TypeLabel type="car" className="self-start" />
            </article>
          </section>
        )}
      </div>

      <aside className="space-y-4 lg:sticky lg:top-24">
        <section aria-labelledby="rules-title" className="bg-card border border-line rounded-card p-5">
          <h2 id="rules-title" className="text-lg font-bold text-ink mb-3">
            Как устроен доступ
          </h2>
          <ul className="space-y-3 text-sm text-muted">
            {RULES.map((r) => (
              <li key={r.title}>
                <span className="font-semibold text-ink">{r.title}</span> {r.text}
              </li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="log-title" className="bg-card border border-line rounded-card p-5">
          <h2 id="log-title" className="text-lg font-bold text-ink mb-3">
            Журнал действий
          </h2>
          <ol className="space-y-2.5 text-sm">
            {state.log.slice(0, 6).map((l) => (
              <li key={l.id} className="flex gap-3">
                <span className="text-muted tabular whitespace-nowrap w-20 shrink-0">{formatDay(l.at)}</span>
                <span className="text-ink">{l.text}</span>
              </li>
            ))}
          </ol>
        </section>
      </aside>

      <AddPersonDialog
        open={adding}
        onClose={() => {
          setAdding(false)
        }}
      />
      <ConfirmDialog
        open={revoking !== null}
        title="Отозвать доступ?"
        description={
          revoking
            ? `${revoking.full} перестанет видеть начисления семьи и оплачивать их. Его или её начисления исчезнут из вашей «Далони», история платежей сохранится.`
            : ''
        }
        confirmLabel="Отозвать доступ"
        cancelLabel="Оставить как есть"
        isDanger
        onCancel={() => {
          setRevoking(null)
        }}
        onConfirm={() => {
          if (revoking) {
            setConsent(revoking.id, 'revoked')
            showToast({ message: `Доступ отозван: ${revoking.name}` })
          }
          setRevoking(null)
        }}
      />
    </div>
  )
}
