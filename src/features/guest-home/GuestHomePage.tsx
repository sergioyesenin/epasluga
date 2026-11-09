import { Link } from 'react-router-dom'
import { Button, Card } from '../../design-system'
// Импортируем существующие компоненты поиска и ситуаций
import { QuickSearch } from '../home/QuickSearch'
import { LifeSituations } from '../home/LifeSituations'
import { services } from '../../data/services'

export function GuestHomePage() {
  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-16 pt-4">
      
      {/* 1. HERO SECTION */}
      <section className="text-center md:text-left md:flex md:items-center md:justify-between gap-8 bg-gradient-to-r from-[#f8f9ff] to-white p-8 md:p-12 rounded-card border border-line shadow-sm">
        <div className="md:w-3/5 mb-6 md:mb-0">
          <h1 className="text-3xl md:text-4xl font-bold text-navy-deep mb-4 leading-tight">
            Госуслуги <span className="text-navy">онлайн</span> — без очередей и бумаг
          </h1>
          <p className="text-lg text-muted mb-8">
            Единый портал для решения любых жизненных ситуаций. От рождения ребёнка до покупки автомобиля.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/login">
              <Button className="w-full sm:w-auto text-lg px-8 py-3">
                Войти через ID-карту
              </Button>
            </Link>
            <Link to="/catalog?view=situations">
              <Button variant="ghost" className="w-full sm:w-auto text-lg px-8 py-3">
                Смотреть ситуации
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Декоративный элемент */}
        <div className="hidden md:flex md:w-2/5 justify-center">
          <div className="w-48 h-48 bg-navy rounded-full flex items-center justify-center text-7xl shadow-xl text-white">
            🇧🇾
          </div>
        </div>
      </section>

      {/* 2. ПОИСК */}
      <section>
        <div className="max-w-3xl mx-auto text-center mb-6">
          <h2 className="text-2xl font-bold text-navy-deep mb-2">Что вы хотите сделать?</h2>
          <p className="text-muted">Начните с поиска или выберите из популярных категорий ниже.</p>
        </div>
        <div className="flex justify-center">
          <QuickSearch />
        </div>
      </section>

      {/* 3. ЖИЗНЕННЫЕ СИТУАЦИИ (Превью) */}
      <section>
        <LifeSituations />
      </section>

      {/* 4. ПОПУЛЯРНЫЕ УСЛУГИ */}
      <section>
        <div className="flex justify-between items-end mb-4">
          <div>
            <h2 className="text-lg font-bold text-navy-deep">Часто запрашивают</h2>
            <p className="text-sm text-muted">Самые популярные услуги на портале</p>
          </div>
          <Link to="/catalog?view=list" className="text-sm font-semibold text-navy hover:underline">
            Все услуги →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {services.slice(0, 3).map((service) => (
            <Link key={service.id} to={`/service/${service.id}`} className="block h-full group">
              <Card variant="interactive" className="h-full flex flex-col p-5">
                <h3 className="font-semibold text-navy mb-2 group-hover:text-navy-deep transition-colors">
                  {service.shortTitle}
                </h3>
                <p className="text-sm text-muted mb-4 line-clamp-2 flex-1">
                  {service.plainDescription}
                </p>
                <div className="mt-auto pt-3 border-t border-line flex items-center justify-between text-xs font-semibold text-navy">
                  <span>⏱ {service.timeToComplete}</span>
                  <span>Оформить →</span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. БЛОК ДОВЕРИЯ */}
      <section className="bg-soft rounded-card p-6 md:p-8 text-center">
        <h2 className="text-xl font-bold text-navy-deep mb-6">Почему это безопасно</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl shadow-sm mb-3">🛡️</div>
            <h3 className="font-semibold text-ink mb-1">Защита данных</h3>
            <p className="text-sm text-muted">Работает на базе защищенных государственных систем</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl shadow-sm mb-3">🆔</div>
            <h3 className="font-semibold text-ink mb-1">Вход по ID-карте</h3>
            <p className="text-sm text-muted">Надежная идентификация через ГосСУОК</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl shadow-sm mb-3">⏱️</div>
            <h3 className="font-semibold text-ink mb-1">Экономия времени</h3>
            <p className="text-sm text-muted">Без визитов в ведомства и бумажных справок</p>
          </div>
        </div>
      </section>

    </div>
  )
}