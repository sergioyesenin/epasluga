import { Link } from 'react-router-dom'
import { Badge, Card, EmptyState } from '../../../design-system'
import { useApplications } from '../../../lib/applications'
import { useNotifications } from '../../../lib/notifications'
import { mockDocuments } from '../../../data/mockDocuments'
import { mockMail } from '../../../data/mockMail'
import { formatWhen, statusClass } from '../../../lib/format'
import { ClockIcon, FileIcon, InfoIcon } from '../../../lib/situationIcons'
import type { CabinetTab } from '../ProfilePage'

type Props = { onNavigate: (tab: CabinetTab) => void }

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
      {/* Активные заявления */}
      <Card className="lg:col-span-1">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-navy-deep">Активные заявления</h2>
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
                    <div className="font-semibold text-navy-deep truncate">{a.title}</div>
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
          <h2 className="text-lg font-bold text-navy-deep">Последние документы</h2>
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
                  <div className="font-semibold text-navy-deep truncate">{d.title}</div>
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
          <h2 className="text-lg font-bold text-navy-deep">Непрочитанная почта</h2>
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
                  <div className="font-semibold text-navy-deep truncate">{m.subject}</div>
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
          <h2 className="text-lg font-bold text-navy-deep">Уведомления</h2>
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
                  <div className="font-semibold text-navy-deep truncate">{n.title}</div>
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