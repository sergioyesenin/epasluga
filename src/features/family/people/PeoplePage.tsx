import { Icon } from '../../../design-system'
import { useDalon } from '../../../hooks/useDalon'
import { representatives } from '../../../lib/dalon/selectors'
import { MemberAvatar } from '../components/MemberAvatar'
import { ActionLog } from './ActionLog'
import { AssetCard } from './AssetCard'
import { ChildCard } from './ChildCard'
import { PersonCard } from './PersonCard'
import { ZagsDemoPanel } from './ZagsDemoPanel'

/** Главное правило раздела — дословно, как его видит пользователь. */
export const ZAGS_RULE =
  'Изменить состав семьи можно только по решению ЗАГС: при регистрации расторжения брака или смерти.'

const RULES = [
  {
    title: 'Состав семьи — по записям ЗАГС.',
    text: 'Супруг появляется сам после регистрации брака, ребёнок — после регистрации рождения. Добавить или убрать человека вручную нельзя.',
  },
  {
    title: '«Видит» даёт сама связь.',
    text: 'Пока действует запись о браке, супруги видят начисления и сроки всей семьи.',
  },
  {
    title: '«Платит» включают сами взрослые.',
    text: 'Каждый супруг решает за себя, может ли он оплачивать начисления семьи.',
  },
  {
    title: 'Связь закрывает только ЗАГС.',
    text: 'Запись о расторжении брака закрывает связь с супругом, запись о смерти — с любым членом семьи. Начисления человека исчезают, история платежей остаётся.',
  },
  {
    title: 'Дети — до 18 лет.',
    text: 'Родители — законные представители: видят садик, школу и кружки. В 18 лет представительство прекращается само.',
  },
]

/** «Семья и права»: состав семьи по записям ЗАГС, права взрослых, дети и имущество. */
export function PeoplePage() {
  const { state, now } = useDalon()
  const me = state.people.find((p) => p.id === 'me')
  const adults = state.people.filter((p) => p.kind === 'adult' && p.id !== 'me')
  const kids = state.people.filter((p) => p.kind === 'child')
  const parents = representatives(state)
    .map((p) => (p.id === 'me' ? 'вы' : p.name))
    .join(' и ')

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-6 items-start">
      <div className="space-y-8 min-w-0">
        <section
          aria-labelledby="zags-rule"
          className="flex gap-3 rounded-card border border-family-wine/20 bg-family-wine-tint p-4 md:p-5"
        >
          <Icon name="shield" className="w-6 h-6 shrink-0 text-family-wine" />
          <div>
            <h2 id="zags-rule" className="font-semibold text-family-wine-ink leading-snug">
              {ZAGS_RULE}
            </h2>
            <p className="mt-1 text-sm text-family-wine-ink/85">
              Новые члены семьи появляются сами: супруг — после регистрации брака, ребёнок — после
              регистрации рождения. Так никто не получит доступ к данным семьи без записи ЗАГС.
            </p>
          </div>
        </section>

        <section aria-labelledby="adults-title" className="space-y-3">
          <h2 id="adults-title" className="text-lg font-bold text-ink">
            Взрослые
          </h2>

          {me && (
            <article className="bg-card border border-line rounded-card p-4 md:p-5 flex items-start gap-3">
              <MemberAvatar kind="adult" initials={me.initials} size="md" />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-ink leading-snug">{me.full}</h3>
                <p className="text-sm text-muted mb-2">Вы — владелец кабинета</p>
                <span className="inline-flex rounded-full bg-family-wine-tint text-family-wine-ink px-2.5 py-1 text-xs font-semibold">
                  Видит и платит
                </span>
              </div>
            </article>
          )}

          {adults.map((p) => (
            <PersonCard key={p.id} person={p} />
          ))}

          <p className="flex gap-3 rounded-xl border border-dashed border-line-2 px-4 py-3 text-sm text-muted">
            <Icon name="info" className="w-5 h-5 shrink-0" />
            Связь со взрослым появится автоматически после регистрации брака в ЗАГС. Добавлять
            вручную и ждать согласия не нужно.
          </p>
        </section>

        <section aria-labelledby="kids-title" className="space-y-3">
          <h2 id="kids-title" className="text-lg font-bold text-ink">
            Дети
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {kids.map((k) => (
              <ChildCard key={k.id} child={k} parents={parents} now={now} />
            ))}
          </div>
        </section>

        <section aria-labelledby="assets-title" className="space-y-3">
          <h2 id="assets-title" className="text-lg font-bold text-ink">
            Имущество
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {state.assets.map((a) => (
              <AssetCard key={a.id} asset={a} />
            ))}
          </div>
        </section>
      </div>

      <aside className="space-y-4">
        <section
          aria-labelledby="rules-title"
          className="bg-card border border-line rounded-card p-5"
        >
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
        <ZagsDemoPanel />
        <ActionLog entries={state.log} />
      </aside>
    </div>
  )
}
