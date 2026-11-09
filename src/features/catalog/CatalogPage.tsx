import { useMemo, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { categories } from '../../data/categories'
import { lifeSituations } from '../../data/situations'
import { searchServices } from '../../lib/search'
import { useFavorites } from '../../lib/favorites'
import { getSituationIcon } from '../../lib/situationIcons'
import { CatalogCard } from './CatalogCard'
import { CategoryGrid } from './CategoryGrid'
import { EmptyState, Card, Input, Button } from '../../design-system'
import clsx from 'clsx'

type Mode = 'cats' | 'list' | 'favs' | 'situations'

function parseMode(raw: string | null): Mode {
  if (raw === 'list' || raw === 'favs' || raw === 'situations') return raw
  return 'cats'
}

export function CatalogPage() {
  const [params, setParams] = useSearchParams()
  const mode = parseMode(params.get('view'))
  const categoryId = params.get('cat') ?? ''
  const query = params.get('q') ?? ''

  const [draftQuery, setDraftQuery] = useState(query)
  const { favs, toggle, has } = useFavorites()

  const activeCategory = categories.find((c) => c.id === categoryId)

  const filteredServices = useMemo(() => {
    let list = searchServices(query).map((h) => h.service)
    if (categoryId) list = list.filter((s) => s.category === categoryId)
    return list
  }, [query, categoryId])

  const filteredSituations = useMemo(() => {
    if (!query) return lifeSituations
    const q = query.toLowerCase()
    return lifeSituations.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.painPoint.toLowerCase().includes(q) ||
        s.outcome.toLowerCase().includes(q),
    )
  }, [query])

  const favList = useMemo(
    () => filteredServices.filter((s) => favs.has(s.id)),
    [filteredServices, favs],
  )

  const patchParams = (patch: Record<string, string | null>) => {
    const next = new URLSearchParams(params)
    Object.entries(patch).forEach(([k, v]) => {
      if (v === null || v === '') next.delete(k)
      else next.set(k, v)
    })
    setParams(next)
  }

  const setMode = (m: Mode) => patchParams({ view: m, cat: null, q: null })
  const submitQuery = () => patchParams({ q: draftQuery.trim() || null })
  const resetFilters = () => {
    setDraftQuery('')
    setParams(new URLSearchParams())
  }

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-navy-deep mb-2">
          {mode === 'situations'
            ? 'Жизненные ситуации'
            : mode === 'favs'
              ? 'Избранные услуги'
              : activeCategory
                ? activeCategory.title
                : mode === 'list'
                  ? 'Все услуги'
                  : 'Услуги по категориям'}
        </h1>
        <p className="text-muted max-w-2xl">
          {mode === 'situations'
            ? 'Пошаговые маршруты для типовых задач: от рождения ребёнка до покупки автомобиля.'
            : mode === 'favs'
              ? 'Услуги, отмеченные звёздочкой. В общем списке они тоже стоят первыми.'
              : activeCategory
                ? activeCategory.desc
                : 'Выберите тему — или найдите услугу своими словами.'}
        </p>
      </header>

      {/* ГЛОБАЛЬНЫЙ ПОИСК */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-end mb-6">
        <div className="flex-1">
          <label htmlFor="catalog-q" className="block text-xs text-muted mb-1">
            Что вы хотите сделать?
          </label>
          <Input
            id="catalog-q"
            type="search"
            value={draftQuery}
            onChange={(e) => setDraftQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submitQuery()}
            placeholder="Например: справка о доходах, регистрация авто, пособие..."
            className="h-11"
          />
        </div>
        <div className="flex gap-2">
          <Button onClick={submitQuery} className="h-11">
            Найти
          </Button>
          {query && (
            <Button variant="ghost" onClick={resetFilters} className="h-11">
              Сбросить
            </Button>
          )}
        </div>
      </div>

      {/* Переключатель режимов */}
      <div className="inline-flex flex-wrap gap-1 mb-5 bg-soft p-1 rounded-full">
        {(
          [
            ['situations', 'Жизненные ситуации'],
            ['cats', 'По категориям'],
            ['list', 'Все услуги'],
            ['favs', 'Избранное'],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setMode(value)}
            className={clsx(
              'px-4 py-2 rounded-full text-sm font-semibold transition-colors',
              mode === value ? 'bg-white text-navy shadow-sm' : 'text-muted hover:text-navy',
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Жизненные ситуации */}
      {mode === 'situations' && (
        <>
          {filteredSituations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in duration-300">
              {filteredSituations.map((sit) => (
                <Link key={sit.id} to={`/situation/${sit.id}`} className="block group h-full">
                  <Card variant="interactive" className="h-full flex flex-col p-5">
                    <div className="flex items-start gap-3 mb-3">
                      <span className="text-3xl shrink-0" aria-hidden="true">
                        {getSituationIcon(sit.id)}
                      </span>
                      <h3 className="text-lg font-bold text-navy group-hover:text-navy-deep transition-colors leading-tight">
                        {sit.title}
                      </h3>
                    </div>
                    <p className="text-sm text-muted mb-4 flex-1 line-clamp-3">{sit.painPoint}</p>
                    <div className="mt-auto pt-4 border-t border-line flex justify-between items-center text-sm font-semibold text-navy">
                      <span className="bg-[#e8eeff] text-navy px-2 py-1 rounded text-xs">
                        {sit.steps.length} {pluralizeSteps(sit.steps.length)}
                      </span>
                      <span className="group-hover:translate-x-1 transition-transform">Начать →</span>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState
              title="Ничего не найдено"
              description="По вашему запросу нет подходящих ситуаций. Попробуйте изменить запрос."
            />
          )}
        </>
      )}

      {/* Категории */}
      {mode === 'cats' && !activeCategory && <CategoryGrid categories={categories} />}

      {/* Список услуг и Избранное */}
      {(mode === 'list' || mode === 'favs' || (mode === 'cats' && activeCategory)) && (
        <>
          {mode === 'list' && (
            <div className="text-sm text-muted mb-3">
              {filteredServices.length > 0 ? (
                <>Найдено: <b className="text-ink">{filteredServices.length}</b></>
              ) : (
                'Ничего не найдено'
              )}
            </div>
          )}

          {(mode === 'list' || mode === 'cats' ? filteredServices : favList).length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {(mode === 'list' || mode === 'cats' ? filteredServices : favList).map((s) => (
                <CatalogCard
                  key={s.id}
                  service={s}
                  isFavorite={has(s.id)}
                  onToggleFavorite={() => toggle(s.id)}
                />
              ))}
            </div>
          ) : mode === 'favs' ? (
            <EmptyState
              title="Пока пусто"
              description="Откройте каталог и нажмите звёздочку на карточке — услуга появится здесь."
              action={
                <button
                  type="button"
                  onClick={() => setMode('list')}
                  className="inline-flex items-center justify-center rounded-control px-4 py-2.5 text-[15px] font-semibold bg-navy text-white hover:bg-navy-deep"
                >
                  Открыть все услуги
                </button>
              }
            />
          ) : (
            <EmptyState
              title="Ничего не найдено"
              description="Попробуйте изменить запрос или сбросить фильтры."
              action={
                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex items-center justify-center rounded-control px-4 py-2.5 text-[15px] font-semibold border border-navy text-navy hover:bg-soft"
                >
                  Сбросить
                </button>
              }
            />
          )}
        </>
      )}
    </div>
  )
}

/** Склонение слова «шаг» для бейджа. */
function pluralizeSteps(n: number): string {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return 'шаг'
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return 'шага'
  return 'шагов'
}