import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useApplications } from '../../../lib/applications'
import { services } from '../../../data/services'
import { statusHelp } from '../../../lib/format'
import { downloadDemoPdf } from '../../../lib/download'
import { MyServicesRow } from '../../my-services/MyServicesRow'
import { EmptyState, ErrorState, SkeletonList } from '../../../design-system'
import type { ApplicationStatus } from '../../../types/service'
import clsx from 'clsx'

const FILTERS: Array<{ id: ApplicationStatus | 'all'; label: string }> = [
  { id: 'all', label: 'Все' },
  { id: 'На проверке', label: 'На проверке' },
  { id: 'Выполнено', label: 'Выполнено' },
  { id: 'Ожидает оплаты', label: 'Ожидает оплаты' },
]

type ViewState = 'idle' | 'loading' | 'error'

export function AppsTab() {
  const { apps, update } = useApplications()
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'all'>('all')
  const [viewState, setViewState] = useState<ViewState>('idle')

  const filtered = useMemo(
    () => (statusFilter === 'all' ? apps : apps.filter((a) => a.status === statusFilter)),
    [apps, statusFilter],
  )

  const reload = () => {
    setViewState('loading')
    window.setTimeout(() => setViewState('idle'), 500)
  }

  if (viewState === 'loading') return <SkeletonList rows={5} />
  if (viewState === 'error') return <ErrorState onRetry={() => setViewState('idle')} />

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setStatusFilter(f.id)}
            className={clsx(
              'px-4 py-2 rounded-full text-sm font-semibold transition-colors min-h-11',
              statusFilter === f.id
                ? 'bg-navy text-white'
                : 'bg-white text-navy border border-line hover:border-navy',
            )}
          >
            {f.label}
          </button>
        ))}
        <button
          type="button"
          onClick={reload}
          className="ml-auto min-h-11 px-2 text-xs text-muted underline hover:text-navy"
        >
          Обновить
        </button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="У вас пока нет заявлений"
          description="Откройте каталог и начните с любой услуги — черновик сохранится автоматически."
          action={
            <Link
              to="/catalog"
              className="inline-flex items-center justify-center rounded-control px-4 min-h-11 text-[15px] font-semibold bg-navy text-white hover:bg-navy-deep"
            >
              Перейти в каталог
            </Link>
          }
        />
      ) : (
        <div className="bg-white border border-line rounded-card overflow-x-auto">
          <table className="w-full text-left text-sm responsive-table">
            <thead className="bg-soft text-muted text-xs font-semibold">
              <tr>
                <th className="px-4 py-3 font-semibold">Услуга</th>
                <th className="px-4 py-3 font-semibold">Дата</th>
                <th className="px-4 py-3 font-semibold">Статус</th>
                <th className="px-4 py-3 font-semibold text-right">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filtered.map((app) => {
                const svc = services.find((s) => s.id === app.serviceId)
                return (
                  <MyServicesRow
                    key={app.id}
                    app={app}
                    href={svc ? `/service/${svc.id}` : null}
                    onPay={() => update(app.id, { status: 'Выполнено' })}
                    onDownload={() => downloadDemoPdf(app)}
                    help={statusHelp(app.status)}
                  />
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}