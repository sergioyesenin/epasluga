import { Link } from 'react-router-dom'
import { QuickSearch } from './QuickSearch'
import { QuickActions } from './QuickActions'
import { LifeSituations } from './LifeSituations'
import { useApplications } from '../../lib/applications'
import { useAuth } from '../../contexts/AuthContext'
import { Badge, Card } from '../../design-system'
import { statusClass } from '../../lib/format'

export function HomePage() {
  const { user } = useAuth()
  const { apps } = useApplications()
  const active = apps
    .filter((a) => ['На проверке', 'Ожидает оплаты', 'Черновик'].includes(a.status))
    .slice(0, 3)
  const firstName = user?.name.split(' ')[1] ?? ''

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-12">
      <section className="pt-4">
        <h1 className="text-3xl font-bold text-ink mb-4">
          Добрый день{firstName ? `, ${firstName}` : ''}!
        </h1>
        <QuickSearch />
      </section>

      <section>
        <QuickActions />
      </section>

      {active.length > 0 && (
        <section>
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-lg font-bold text-ink">Статус последних заявлений</h2>
            <Link to="/profile?tab=apps" className="text-sm text-navy hover:underline">
              Все услуги
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {active.map((a) => (
              <Link key={a.id} to="/profile?tab=apps" className="block h-full">
                <Card variant="interactive" className="h-full">
                  <h3 className="font-semibold text-navy mb-2 leading-tight">{a.title}</h3>
                  <Badge className={statusClass(a.status)}>{a.status}</Badge>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section>
        <LifeSituations />
      </section>
    </div>
  )
}