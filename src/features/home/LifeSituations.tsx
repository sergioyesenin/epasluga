import { Link } from 'react-router-dom'
import { Card } from '../../design-system'
import { lifeSituations } from '../../data/situations'

const ICONS: Record<string, string> = {
  birth: '👶',
  'buy-car': '🚗',
  university: '🎓',
}

export function LifeSituations() {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-navy-deep">Жизненные ситуации</h2>
        <Link
          to="/catalog?view=situations"
          className="text-sm text-navy hover:underline"
        >
          Все ситуации →
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {lifeSituations.map((sit) => (
          <Link
            key={sit.id}
            to={`/situation/${sit.id}`}
            className="block h-full group"
          >
            <Card
              variant="interactive"
              className="h-full items-center text-center justify-center p-6 gap-3"
            >
              <span className="text-4xl">{ICONS[sit.id] ?? '📋'}</span>
              <span className="font-semibold text-navy-deep text-sm">
                {sit.title}
              </span>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}