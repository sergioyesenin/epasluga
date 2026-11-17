import { Link, useParams } from 'react-router-dom'
import { Badge, Card } from '../../design-system'
import { passportById } from '../../data/situationPassports'
import { xcById } from '../../data/xcComponents'
import { lifeSituations } from '../../data/situations'

import { useDocumentTitle } from '../../hooks/useDocumentTitle'

export function PassportPage() {
  const { id } = useParams()
  const passport = id ? passportById(id) : undefined
  const situation = passport ? lifeSituations.find((s) => s.registryId === passport.id) : undefined
  useDocumentTitle(passport ? `Паспорт ситуации: ${passport.name}` : 'Паспорт не найден')

  if (!passport) {
    return (
      <div className="text-center py-12 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold text-ink mb-4">Паспорт не найден</h1>
        <p className="text-muted mb-6">
          В прототипе пока есть паспорта только для ситуаций Волны 1: LS-01, LS-13, LS-19, LS-23,
          BS-07.
        </p>
        <Link
          to="/catalog?view=situations"
          className="inline-flex items-center justify-center rounded-control px-4 min-h-11 text-[15px] font-semibold bg-navy text-white hover:bg-navy-deep"
        >
          К жизненным ситуациям
        </Link>
      </div>
    )
  }

  const xcList = passport.dependencies
    .map((xcId) => xcById[xcId])
    .filter((x): x is NonNullable<typeof x> => Boolean(x))

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="text-sm text-muted mb-2">
        <Link to="/catalog?view=situations" className="hover:text-navy">
          Жизненные ситуации
        </Link>{' '}
        / <span>Паспорт {passport.id}</span>
      </div>

      <header className="mb-6">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <Badge variant="code">{passport.id}</Badge>
          {situation && (
            <Link
              to={`/situation/${situation.id}`}
              className="text-sm font-semibold text-navy hover:underline"
            >
              → открыть ситуацию
            </Link>
          )}
        </div>
        <h1 className="text-3xl font-bold text-ink leading-tight">{passport.name}</h1>
      </header>

      {passport.legalVerificationRequired && (
        <Card className="bg-[#fff4e5] border-[#edd9b3] mb-6">
          <p className="text-sm text-accent-warm">
            <b className="text-ink">⚠️ Правовая основа требует верификации.</b> Коды процедур из
            постановления № 221, распоряжение № 119р и сроки из указов 2026 г. — рабочие гипотезы.
            Перед спецификацией их нужно сверить с реестром административных процедур и материалами
            НЦЭУ.
          </p>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card>
          <p className="text-xs uppercase tracking-wide text-muted mb-1">Владелец процесса</p>
          <p className="text-sm font-semibold text-ink">{passport.owner}</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-wide text-muted mb-1">Триггер</p>
          <p className="text-sm font-semibold text-ink">{passport.trigger}</p>
        </Card>
      </div>

      <Card className="mb-6">
        <h2 className="font-bold text-ink mb-2">Правовая основа</h2>
        <p className="text-sm text-muted whitespace-pre-line">{passport.legalBasis}</p>
      </Card>

      <Card className="mb-6">
        <h2 className="font-bold text-ink mb-3">Участники</h2>
        <ul className="flex flex-wrap gap-2">
          {passport.participants.map((p) => (
            <li
              key={p}
              className="inline-flex items-center bg-soft text-ink rounded-full px-3 py-1.5 text-sm"
            >
              {p}
            </li>
          ))}
        </ul>
      </Card>

      <Card className="mb-6">
        <h2 className="font-bold text-ink mb-3">Целевой маршрут</h2>
        <ol className="space-y-3">
          {passport.targetRoute.map((stage, i) => (
            <li key={i} className="flex gap-3">
              <span
                className={
                  stage.online
                    ? 'shrink-0 w-6 h-6 rounded-full bg-[#e6f6ec] text-ok inline-flex items-center justify-center text-xs font-bold'
                    : 'shrink-0 w-6 h-6 rounded-full bg-[#fdecea] text-danger inline-flex items-center justify-center text-xs font-bold'
                }
                aria-hidden="true"
              >
                {stage.online ? '✓' : '!'}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-ink text-sm">{stage.stage}</span>
                  <Badge variant={stage.online ? 'accent' : 'need-id'}>
                    {stage.online ? 'онлайн' : 'офлайн'}
                  </Badge>
                </div>
                {stage.why && <p className="text-xs text-muted mt-0.5">{stage.why}</p>}
              </div>
            </li>
          ))}
        </ol>
      </Card>

      <Card className="mb-6">
        <h2 className="font-bold text-ink mb-3">Данные</h2>
        <div className="overflow-x-auto -mx-4 px-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-muted border-b border-line">
                <th className="py-2 pr-3 font-semibold">Атрибут</th>
                <th className="py-2 pr-3 font-semibold">Источник</th>
                <th className="py-2 font-semibold">Мастер-источник</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {passport.data.map((d) => (
                <tr key={d.attr}>
                  <td className="py-2 pr-3 text-ink font-medium">{d.attr}</td>
                  <td className="py-2 pr-3 text-muted">{d.source}</td>
                  <td className="py-2 text-muted">{d.master ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card>
          <h2 className="font-bold text-ink mb-2">Каналы</h2>
          <ul className="flex flex-wrap gap-2">
            {passport.channels.map((c) => (
              <li
                key={c}
                className="inline-flex items-center bg-soft text-ink rounded-full px-3 py-1.5 text-sm"
              >
                {c}
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <h2 className="font-bold text-ink mb-2">Результат для пользователя</h2>
          <p className="text-sm text-ink">{passport.result}</p>
        </Card>
      </div>

      <Card className="mb-6">
        <h2 className="font-bold text-ink mb-3">Метрики</h2>
        <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div>
            <dt className="text-xs uppercase tracking-wide text-muted mb-0.5">Доля онлайн</dt>
            <dd className="tabular font-semibold text-ink">
              {passport.metrics.onlineShare != null
                ? `${Math.round(passport.metrics.onlineShare * 100)}%`
                : '—'}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-muted mb-0.5">Время</dt>
            <dd className="font-semibold text-ink">{passport.metrics.time ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-muted mb-0.5">Визитов</dt>
            <dd className="tabular font-semibold text-ink">{passport.metrics.visits ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-muted mb-0.5">Отказов</dt>
            <dd className="tabular font-semibold text-ink">
              {passport.metrics.refusals != null
                ? `${Math.round(passport.metrics.refusals * 100)}%`
                : '—'}
            </dd>
          </div>
        </dl>
      </Card>

      <Card>
        <h2 className="font-bold text-ink mb-3">Зависимости (сквозные компоненты)</h2>
        {xcList.length === 0 ? (
          <p className="text-sm text-muted">Нет.</p>
        ) : (
          <ul className="space-y-3">
            {xcList.map((xc) => (
              <li key={xc.id}>
                <div className="flex items-center gap-2 mb-0.5">
                  <Badge variant="code">{xc.id}</Badge>
                  <span className="font-semibold text-ink">{xc.title}</span>
                </div>
                <p className="text-xs text-muted">{xc.purpose}</p>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <p className="text-xs text-muted mt-8">
        Источник — мастер-реестр ситуаций, раздел 5 «Шаблон паспорта ситуации». Юридические привязки
        требуют верификации.
      </p>
    </div>
  )
}
