import { Link } from 'react-router-dom'
import { Card } from '../../design-system'
import { lifeSituations } from '../../data/situations'
import { SituationIcon } from '../../lib/situationIcons'

export function LifeSituations() {
  // Показываем первые 3 ситуации для превью на главной
  const featuredSituations = lifeSituations.slice(0, 3)

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-ink">Жизненные ситуации</h2>
        <Link
          to="/catalog?view=situations"
          className="text-sm text-navy hover:underline"
        >
          Все ситуации
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {featuredSituations.map((sit) => (
          <Link
            key={sit.id}
            to={`/situation/${sit.id}`}
            className="block h-full group"
          >
            <Card
              variant="interactive"
              className="h-full items-center text-center justify-center p-6 gap-3"
            >
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#e8eeff] text-navy">
                <SituationIcon id={sit.id} className="w-6 h-6" />
              </span>
              <span className="font-semibold text-ink text-sm">
                {sit.title}
              </span>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}