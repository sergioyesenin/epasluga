import { Link } from 'react-router-dom'
import { Badge, Card, EmptyState } from '../../../design-system'
import { useApplications } from '../../../lib/applications'
import { useNotifications } from '../../../lib/notifications'
import { mockDocuments } from '../../../data/mockDocuments'
import { mockMail } from '../../../data/mockMail'
import { xcComponents } from '../../../data/xcComponents'
import { lifeSituations } from '../../../data/situations'
import { formatWhen, statusClass } from '../../../lib/format'
import { ClockIcon, FileIcon, InfoIcon } from '../../../lib/situationIcons'
import type { CabinetTab } from '../ProfilePage'

type Props = { onNavigate: (tab: CabinetTab) => void }

const PRIORITY_XC = ['XC-01', 'XC-02', 'XC-06']

function PriorityBlock() {
  const items = xcComponents.filter((x) => PRIORITY_XC.includes(x.id))

  return (
    <Card className="lg:col-span-2 bg-[#f8f9ff] border-line">
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
        <h2 className="text-lg font-bold text-ink">Что улучшим в первую очередь</h2>
        <span className="text-xs text-muted">
          Это разблокирует большинство услуг
        </span>
      </div>
      <p className="text-sm text-muted mb-3">
        Несколько общих «кирпичей», на которых держатся все остальные услуги.
        Когда они готовы — новая услуга запускается быстрее и без повторного
        сбора одних и тех же данных.
      </p>
      <ul className="grid sm:grid-cols-3 gap-3">
        {items.map((xc) => {
          const situations = xc.affectedSituations
            .map((rid) => lifeSituations.find((s) => s.registryId === rid))
            .filter((s): s is NonNullable<typeof s> => Boolean(s))
          return (
            <li
              key={xc.id}
              className="bg-white border border-line rounded-control p-3"
            >
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="code">{xc.id}</Badge>
                <span className="font-semibold text-ink text-sm leading-tight">
                  {xc.title}
                </span>
              </div>
              <p className="text-xs text-muted mb-2">{xc.purpose}</p>
              {situations.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {situations.slice(0, 3).map((s) => (
                    <Link
                      key={s.id}
                      to={`/situation/${s.id}`}
                      className="inline-flex items-center text-xs font-semibold text-navy hover:underline"
                    >
                      {s.title}
                    </Link>
                  ))}
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </Card>
  )
}

export function OverviewTab({ onNavigate }: Props) {
  const { apps } = useApplications()
  const { items: notifications } = useNotifications()

  const activeApps = apps.filter((a) =>
    ['На проверке', 'Ожидает оплаты', 'Черновик'].includes(a.status),
  )
  const unreadMail = mockMail.filter((m) => m.direction === 'in' && !m.read)
  const unreadNotifs = notifications.filter((n) => !n.archived)
  const recentDocs = [...mockDocuments]
    .sort((a, b) => (a.issuedAt < b.issuedAt ? 1 : -1))
    .slice(0, 3)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <PriorityBlock />

      {/* Активные заявления */}
      <Card className="lg:col-span-1">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-ink">Активные заявления</h2>
          <button
            type="button"
            onClick={() => onNavigate('apps')}
            className="text-sm font-semibold text-navy hover:underline"
          >
            Все
          </button>
        </div>
        {activeApps.length === 0 ? (
          <p className="text-sm text-muted">Активных заявлений нет.</p>
        ) : (
          <ul className="divide-y divide-line -mx-2">
            {activeApps.slice(0, 3).map((a) => (
              <li key={a.id} className="py-2 px-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="font-semibold text-ink truncate">{a.title}</div>
                    <div className="text-xs text-muted">
                      № {a.num} · {formatWhen(a.at)}
                    </div>
                  </div>
                  <Badge className={statusClass(a.status)}>{a.status}</Badge>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {/* Документы */}
      <Card className="lg:col-span-1">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-ink">Последние документы</h2>
          <button
            type="button"
            onClick={() => onNavigate('docs')}
            className="text-sm font-semibold text-navy hover:underline"
          >
            Все
          </button>
        </div>
        {recentDocs.length === 0 ? (
          <p className="text-sm text-muted">Документов пока нет.</p>
        ) : (
          <ul className="divide-y divide-line -mx-2">
            {recentDocs.map((d) => (
              <li key={d.id} className="py-2 px-2 flex items-start gap-2">
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-soft text-navy shrink-0">
                  <FileIcon className="w-4 h-4" />
                </span>
                <div className="min-w-0">
                  <div className="font-semibold text-ink truncate">{d.title}</div>
                  <div className="text-xs text-muted">
                    {d.issuer} · {formatWhen(d.issuedAt)}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {/* Почта */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-ink">Непрочитанная почта</h2>
          <button
            type="button"
            onClick={() => onNavigate('mail')}
            className="text-sm font-semibold text-navy hover:underline"
          >
            Открыть
          </button>
        </div>
        {unreadMail.length === 0 ? (
          <p className="text-sm text-muted">Все сообщения прочитаны.</p>
        ) : (
          <ul className="divide-y divide-line -mx-2">
            {unreadMail.slice(0, 3).map((m) => (
              <li key={m.id} className="py-2 px-2 flex items-start gap-2">
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-[#fff4e5] text-accent-warm shrink-0">
                  <InfoIcon className="w-4 h-4" />
                </span>
                <div className="min-w-0">
                  <div className="font-semibold text-ink truncate">{m.subject}</div>
                  <div className="text-xs text-muted">
                    {m.agency} · {formatWhen(m.at)}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {/* Уведомления */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-ink">Уведомления</h2>
          <Link
            to="/notifications"
            className="text-sm font-semibold text-navy hover:underline"
          >
            Все
          </Link>
        </div>
        {unreadNotifs.length === 0 ? (
          <EmptyState
            title="Нет новых уведомлений"
            description="Мы пришлём уведомление, когда что-то изменится."
          />
        ) : (
          <ul className="divide-y divide-line -mx-2">
            {unreadNotifs.slice(0, 3).map((n) => (
              <li key={n.id} className="py-2 px-2 flex items-start gap-2">
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-[#e8eeff] text-navy shrink-0">
                  <ClockIcon className="w-4 h-4" />
                </span>
                <div className="min-w-0">
                  <div className="font-semibold text-ink truncate">{n.title}</div>
                  <div className="text-xs text-muted">{formatWhen(n.at)}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  )
}