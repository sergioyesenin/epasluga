import { useSearchParams } from 'react-router-dom'
import clsx from 'clsx'
import { OverviewTab } from './tabs/OverviewTab'
import { AppsTab } from './tabs/AppsTab'
import { DocsTab } from './tabs/DocsTab'
import { MailTab } from './tabs/MailTab'
import { RepoTab } from './tabs/RepoTab'
import { DataTab } from './tabs/DataTab'

export type CabinetTab = 'overview' | 'apps' | 'docs' | 'mail' | 'repo' | 'data'

const TABS: Array<{ id: CabinetTab; label: string }> = [
  { id: 'overview', label: 'Обзор' },
  { id: 'apps', label: 'Заявления' },
  { id: 'docs', label: 'Документы' },
  { id: 'mail', label: 'Почта' },
  { id: 'repo', label: 'Репозиторий' },
  { id: 'data', label: 'Данные' },
]

function parseTab(raw: string | null): CabinetTab {
  if (raw === 'apps' || raw === 'docs' || raw === 'mail' || raw === 'repo' || raw === 'data') {
    return raw
  }
  return 'overview'
}

export function ProfilePage() {
  const [params, setParams] = useSearchParams()
  const tab = parseTab(params.get('tab'))

  const setTab = (next: CabinetTab) => {
    const p = new URLSearchParams(params)
    if (next === 'overview') p.delete('tab')
    else p.set('tab', next)
    setParams(p, { replace: false })
  }

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-navy-deep mb-2">Личный кабинет</h1>
        <p className="text-muted max-w-2xl">
          Заявления, документы, почта и данные из регистра — всё в одном месте.
        </p>
      </header>

      <div
        role="tablist"
        aria-label="Разделы личного кабинета"
        className="flex gap-1 mb-6 overflow-x-auto pb-1 -mx-1 px-1 bg-soft rounded-full p-1 w-fit max-w-full"
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            type="button"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={clsx(
              'shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-colors',
              tab === t.id
                ? 'bg-white text-navy shadow-sm'
                : 'text-muted hover:text-navy',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'overview' && <OverviewTab onNavigate={setTab} />}
      {tab === 'apps' && <AppsTab />}
      {tab === 'docs' && <DocsTab />}
      {tab === 'mail' && <MailTab />}
      {tab === 'repo' && <RepoTab />}
      {tab === 'data' && <DataTab />}
    </div>
  )
}