import clsx from 'clsx'
import type { TestingKind } from '../../../types/dalon'
import { EDU_CITIES } from '../../../data/career'
import { MAX_SUBJECTS, TESTING_KINDS, TESTING_SUBJECTS } from '../../../data/testing'
import type { TestingWizard } from '../../../hooks/useTestingWizard'
import { formatWeekday } from '../../../lib/dates'
import { formatBYN } from '../../../lib/money'

const optionClass = (on: boolean) =>
  clsx(
    'flex gap-3 rounded-xl border px-4 py-3 cursor-pointer transition-colors',
    'has-focus-visible:outline-3 has-focus-visible:outline-family-wine',
    on
      ? 'border-family-wine bg-family-wine-tint'
      : 'border-line-2 bg-card hover:border-family-wine/50',
  )

const selectClass =
  'w-full min-h-11 rounded-control border border-line bg-white px-3 text-[15px] focus:border-family-wine focus:outline-none focus:ring-4 focus:ring-family-wine/15'

const legendClass = 'text-lg font-bold text-ink mb-3'

/** Шаг 1: РТ, ЦТ или ЦЭ — с пояснением, чем они отличаются. */
export function KindStep({ w }: { w: TestingWizard }) {
  return (
    <fieldset>
      <legend className={legendClass}>Какое тестирование</legend>
      <div className="space-y-2.5">
        {(Object.keys(TESTING_KINDS) as TestingKind[]).map((k) => {
          const info = TESTING_KINDS[k]
          return (
            <label key={k} className={optionClass(w.draft.kind === k)}>
              <input
                type="radio"
                name="testing-kind"
                className="w-5 h-5 mt-0.5 accent-family-wine shrink-0"
                checked={w.draft.kind === k}
                onChange={() => {
                  w.setKind(k)
                }}
              />
              <span>
                <span className="block font-semibold text-ink">
                  {info.short} — {info.title}
                </span>
                <span className="block text-sm text-muted mt-0.5">{info.text}</span>
                <span className="block text-sm text-family-wine-ink mt-1">
                  {info.pricePerSubject > 0
                    ? `Демо-цена: ${formatBYN(info.pricePerSubject)} за предмет`
                    : 'В демо — без оплаты'}
                </span>
              </span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

/** Шаг 2: предметы, не больше MAX_SUBJECTS. */
export function SubjectsStep({ w }: { w: TestingWizard }) {
  const full = w.draft.subjects.length >= MAX_SUBJECTS
  return (
    <fieldset>
      <legend className={legendClass}>Предметы</legend>
      <p className="text-sm text-muted -mt-1 mb-3">
        Выбрано {w.draft.subjects.length} из {MAX_SUBJECTS} (демо-ограничение).
      </p>
      <div className="grid sm:grid-cols-2 gap-2">
        {TESTING_SUBJECTS.map((s) => {
          const on = w.draft.subjects.includes(s)
          return (
            <label
              key={s}
              className={clsx(
                optionClass(on),
                'items-center min-h-12',
                !on && full && 'opacity-55',
              )}
            >
              <input
                type="checkbox"
                className="w-5 h-5 accent-family-wine shrink-0"
                checked={on}
                disabled={!on && full}
                onChange={() => {
                  w.toggleSubject(s)
                }}
              />
              <span className="text-ink">{s}</span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

/** Шаг 3: дата (этап) и пункт в выбранном городе. */
export function DateStep({ w }: { w: TestingWizard }) {
  return (
    <div className="space-y-6">
      <fieldset>
        <legend className={legendClass}>Дата</legend>
        <div className="grid sm:grid-cols-2 gap-2.5">
          {w.sessions.map((s) => (
            <label
              key={s.id}
              className={clsx(optionClass(w.draft.sessionId === s.id), 'items-center')}
            >
              <input
                type="radio"
                name="testing-session"
                className="w-5 h-5 accent-family-wine shrink-0"
                checked={w.draft.sessionId === s.id}
                onChange={() => {
                  w.setSession(s.id)
                }}
              />
              <span>
                <span className="block font-semibold text-ink">{formatWeekday(s.date)}</span>
                <span className="block text-sm text-muted">{s.label}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="max-w-xs">
        <label htmlFor="testing-city" className="block text-lg font-bold text-ink mb-2">
          Город
        </label>
        <select
          id="testing-city"
          className={selectClass}
          value={w.draft.city}
          onChange={(e) => {
            w.setCity(e.target.value)
          }}
        >
          {EDU_CITIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <fieldset>
        <legend className={legendClass}>Пункт тестирования</legend>
        <div className="space-y-2">
          {w.points.map((p) => (
            <label
              key={p}
              className={clsx(optionClass(w.draft.point === p), 'items-center min-h-12')}
            >
              <input
                type="radio"
                name="testing-point"
                className="w-5 h-5 accent-family-wine shrink-0"
                checked={w.draft.point === p}
                onChange={() => {
                  w.setPoint(p)
                }}
              />
              <span className="text-ink">{p}</span>
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  )
}

/** Шаг 4: проверить данные, согласие, итог к оплате. */
export function ConfirmStep({ w, name }: { w: TestingWizard; name: string }) {
  const info = TESTING_KINDS[w.draft.kind]
  const session = w.sessions.find((s) => s.id === w.draft.sessionId)
  const rows: [string, string][] = [
    ['Кто сдаёт', name],
    ['Вид', `${info.short} — ${info.title}`],
    ['Предметы', w.draft.subjects.join(', ')],
    ['Дата', session ? `${formatWeekday(session.date)}, ${session.label.toLowerCase()}` : ''],
    ['Пункт', `${w.cityName}, ${w.draft.point}`],
    ['К оплате', w.price > 0 ? formatBYN(w.price) : 'без оплаты (демо)'],
  ]
  return (
    <div>
      <h3 className={legendClass}>Проверьте заявку</h3>
      <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm bg-soft/60 rounded-xl p-4">
        {rows.map(([k, v]) => (
          <div key={k} className="contents">
            <dt className="text-muted">{k}</dt>
            <dd className="text-ink font-semibold">{v}</dd>
          </div>
        ))}
      </dl>
      <label className="mt-5 flex gap-3 text-sm text-ink cursor-pointer">
        <input
          type="checkbox"
          className="w-5 h-5 mt-0.5 accent-family-wine shrink-0"
          checked={w.consent}
          onChange={(e) => {
            w.setConsent(e.target.checked)
          }}
        />
        <span>
          Как законный представитель согласен(на) на передачу данных {name} в РИКЗ для регистрации и
          подтверждаю, что ознакомлен(а) с правилами проведения тестирования.
        </span>
      </label>
    </div>
  )
}
