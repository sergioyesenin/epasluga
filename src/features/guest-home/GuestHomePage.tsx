import { Link } from 'react-router-dom'
import { Button, Card } from '../../design-system'
import { QuickSearch } from '../home/QuickSearch'
import { LifeSituations } from '../home/LifeSituations'
import { services } from '../../data/services'
import {
  ShieldCheckIcon,
  IdCardIcon,
  ClockIcon,
} from '../../lib/situationIcons'

function StatePortalIcon({ className = 'w-24 h-24' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 96 96"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M48 12 20 24v24c0 18 13 33 28 36 15-3 28-18 28-36V24L48 12Z" />
      <path d="m34 48 10 10 18-20" />
    </svg>
  )
}

export function GuestHomePage() {
  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-16 pt-4">
      <section className="text-center md:text-left md:flex md:items-center md:justify-between gap-8 bg-linear-to-r from-[#f8f9ff] to-white p-8 md:p-12 rounded-card border border-line shadow-sm">
        <div className="md:w-3/5 mb-6 md:mb-0">
          <h1 className="text-3xl md:text-4xl font-bold text-navy-deep mb-4 leading-tight">
            Госуслуги <span className="text-navy">онлайн</span> — без очередей и бумаг
          </h1>
          <p className="text-lg text-muted mb-8">
            Единый портал для решения любых жизненных ситуаций. От рождения ребёнка до покупки автомобиля.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/login" className="w-full sm:w-auto">
              <Button className="w-full text-lg px-8">Войти</Button>
            </Link>
            <Link to="/catalog?view=situations" className="w-full sm:w-auto">
              <Button variant="ghost" className="w-full text-lg px-8">
                Смотреть ситуации
              </Button>
            </Link>
          </div>
        </div>

        <div className="hidden md:flex md:w-2/5 justify-center">
          <div className="w-48 h-48 bg-navy rounded-full flex items-center justify-center text-white shadow-xl">
            <StatePortalIcon className="w-24 h-24" />
          </div>
        </div>
      </section>

      <section>
        <div className="max-w-3xl mx-auto text-center mb-6">
          <h2 className="text-2xl font-bold text-navy-deep mb-2">Что вы хотите сделать?</h2>
          <p className="text-muted">Начните с поиска или выберите из популярных категорий ниже.</p>
        </div>
        <div className="flex justify-center">
          <QuickSearch />
        </div>
      </section>

      <section>
        <LifeSituations />
      </section>

      <section>
        <div className="flex justify-between items-end mb-4">
          <div>
            <h2 className="text-lg font-bold text-navy-deep">Часто запрашивают</h2>
            <p className="text-sm text-muted">Самые популярные услуги на портале</p>
          </div>
          <Link to="/catalog?view=list" className="text-sm font-semibold text-navy hover:underline">
            Все услуги
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
                <div className="mt-auto pt-3 border-t border-line flex items-center gap-1.5 text-xs font-semibold text-navy">
                  <ClockIcon className="w-3.5 h-3.5" />
                  {service.timeToComplete}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-soft rounded-card p-6 md:p-8 text-center">
        <h2 className="text-xl font-bold text-navy-deep mb-6">Почему это безопасно</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-navy shadow-sm mb-3">
              <ShieldCheckIcon />
            </div>
            <h3 className="font-semibold text-ink mb-1">Защита данных</h3>
            <p className="text-sm text-muted">Работает на базе защищенных государственных систем</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-navy shadow-sm mb-3">
              <IdCardIcon />
            </div>
            <h3 className="font-semibold text-ink mb-1">Вход по ID-карте</h3>
            <p className="text-sm text-muted">Надежная идентификация через ГосСУОК</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-navy shadow-sm mb-3">
              <ClockIcon />
            </div>
            <h3 className="font-semibold text-ink mb-1">Экономия времени</h3>
            <p className="text-sm text-muted">Без визитов в ведомства и бумажных справок</p>
          </div>
        </div>
      </section>
    </div>
  )
}