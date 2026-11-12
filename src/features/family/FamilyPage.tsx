import { useMemo, useState } from 'react'
import { FamilyOverview } from './FamilyOverview'
import { family, charges, payments, formatBYN, memberById } from '../../data/family'
import { Card } from '../../design-system'

export function FamilyPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [selectedCharges, setSelectedCharges] = useState<Set<string>>(new Set())

  const visibleCharges = useMemo(
    () => (selectedId ? charges.filter((c) => c.memberId === selectedId) : charges),
    [selectedId],
  )

  const selectedTotal = useMemo(() => {
    return charges
      .filter((c) => selectedCharges.has(c.id))
      .reduce((s, c) => s + c.amount, 0)
  }, [selectedCharges])

  const toggleCharge = (id: string) => {
    setSelectedCharges((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-family-wine mb-1">Далонь</h1>
        <p className="text-muted">Всё о семье — в одной ладони.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <FamilyOverview selectedId={selectedId} onSelect={setSelectedId} />

        <div className="space-y-4">
          <Card>
            <h2 className="text-lg font-bold text-navy-deep mb-3">
              {selectedId
                ? `Начисления: ${memberById(selectedId)?.name ?? ''}`
                : `Начисления семьи · ${family.length} человек`}
            </h2>

            <div
              className="flex flex-wrap gap-1.5 mb-3"
              role="tablist"
              aria-label="Фильтр по члену семьи"
            >
              <button
                type="button"
                role="tab"
                aria-selected={!selectedId}
                onClick={() => setSelectedId(null)}
                className={
                  !selectedId
                    ? 'text-xs px-2.5 py-1 rounded-full bg-family-wine text-white font-semibold'
                    : 'text-xs px-2.5 py-1 rounded-full bg-soft text-navy hover:bg-navy/10'
                }
              >
                Все
              </button>
              {family.map((m) => {
                const isOn = selectedId === m.id
                return (
                  <button
                    key={m.id}
                    type="button"
                    role="tab"
                    aria-selected={isOn}
                    onClick={() => setSelectedId(isOn ? null : m.id)}
                    className={
                      isOn
                        ? 'text-xs px-2.5 py-1 rounded-full bg-family-wine text-white font-semibold'
                        : 'text-xs px-2.5 py-1 rounded-full bg-soft text-navy hover:bg-navy/10'
                    }
                  >
                    {m.name.split(' ')[0]}
                  </button>
                )
              })}
            </div>

            <div className="flex justify-end mb-2">
              <button
                type="button"
                onClick={() => {
                  const payable = visibleCharges.filter((c) => c.amount > 0).map((c) => c.id)
                  setSelectedCharges(new Set(payable))
                }}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg text-family-wine hover:bg-family-wine-tint transition-colors"
              >
                Выбрать все к оплате
              </button>
            </div>

            <ul className="divide-y divide-line">
              {visibleCharges.map((c) => {
                const m = memberById(c.memberId)
                const checked = selectedCharges.has(c.id)
                return (
                  <li
                    key={c.id}
                    className="charge-row py-3 flex items-start gap-3 -mx-2 px-2 rounded-lg"
                  >
                    <input
                      type="checkbox"
                      id={`ch-${c.id}`}
                      checked={checked}
                      onChange={() => toggleCharge(c.id)}
                      className="mt-1 w-5 h-5 accent-family-wine"
                    />
                    <label htmlFor={`ch-${c.id}`} className="flex-1 cursor-pointer">
                      <div className="font-semibold text-navy-deep">{c.title}</div>
                      <div className="text-xs text-muted">
                        {m?.name} · {c.detail}
                      </div>
                    </label>
                    <div className="tabular text-right font-bold text-navy-deep whitespace-nowrap">
                      {formatBYN(c.amount)}
                    </div>
                  </li>
                )
              })}
              {visibleCharges.length === 0 && (
                <li className="py-3 text-sm text-muted">
                  По этому члену семьи пока нет начислений.
                </li>
              )}
            </ul>
          </Card>

          <Card>
            <h2 className="text-lg font-bold text-navy-deep mb-2">История платежей</h2>
            <ul className="divide-y divide-line">
              {payments.map((p) => (
                <li
                  key={p.id}
                  className="charge-row py-2 flex justify-between gap-2 text-sm -mx-2 px-2 rounded-lg"
                >
                  <div>
                    <div className="font-semibold text-navy-deep">{p.title}</div>
                    <div className="text-xs text-muted">{p.payee}</div>
                  </div>
                  <div className="tabular font-bold text-navy-deep whitespace-nowrap">
                    {formatBYN(p.amount)}
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>

      {selectedTotal > 0 && (
        <div className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-40 bg-white border border-line-2 shadow-lg rounded-full pl-5 pr-2 py-2 flex items-center gap-4">
          <span className="text-sm text-muted">Выбрано:</span>
          <span className="tabular font-bold text-navy-deep">{formatBYN(selectedTotal)}</span>
          <button
            type="button"
            className="rounded-full bg-family-wine text-white px-4 py-2 text-sm font-semibold hover:bg-family-wine-deep inline-flex items-center gap-2"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <rect x="3" y="7" width="18" height="12" rx="2" />
              <circle cx="16" cy="13" r="1.2" fill="currentColor" />
            </svg>
            Оплатить выбранные
          </button>
        </div>
      )}
    </div>
  )
}
