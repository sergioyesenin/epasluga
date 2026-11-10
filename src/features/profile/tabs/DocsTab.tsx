import { useMemo, useState } from 'react'
import { Badge, Card, EmptyState, SkeletonList } from '../../../design-system'
import { mockDocuments } from '../../../data/mockDocuments'
import { formatWhen } from '../../../lib/format'
import { FileIcon, InfoIcon } from '../../../lib/situationIcons'
import type { Document } from '../../../types/service'

function formatValidUntil(iso?: string): string | null {
  if (!iso) return null
  const d = new Date(iso)
  const now = new Date()
  const days = Math.round((d.getTime() - now.getTime()) / 86400000)
  if (days < 0) return 'истёк'
  if (days === 0) return 'истекает сегодня'
  if (days <= 7) return `истекает через ${days} дн.`
  return `до ${d.toLocaleDateString('ru-BY', { day: 'numeric', month: 'long', year: 'numeric' })}`
}

/** Псевдо-QR: рисуем сетку из блоков по хешу payload. */
function FakeQr({ payload, size = 120 }: { payload: string; size?: number }) {
  const cells = 21
  const cellSize = size / cells
  const hash = (i: number) => {
    let h = 0
    const seed = payload + ':' + i
    for (let k = 0; k < seed.length; k++) h = (h * 31 + seed.charCodeAt(k)) | 0
    return Math.abs(h) % 2 === 0
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label="QR-код документа"
      className="bg-white"
    >
      <rect width={size} height={size} fill="#ffffff" />
      {Array.from({ length: cells * cells }).map((_, idx) => {
        const row = Math.floor(idx / cells)
        const col = idx % cells
        // Уголки-маркеры
        const inCorner =
          (row < 7 && col < 7) ||
          (row < 7 && col >= cells - 7) ||
          (row >= cells - 7 && col < 7)
        const markerBorder =
          inCorner &&
          (row === 0 || row === 6 || col === 0 || col === 6 ||
            row === cells - 1 || row === cells - 7 ||
            col === cells - 1 || col === cells - 7)
        const markerCenter =
          inCorner &&
          row >= 2 &&
          row <= 4 &&
          ((col >= 2 && col <= 4) ||
            (col >= cells - 5 && col <= cells - 3))
        const filled = inCorner ? markerBorder || markerCenter : hash(idx)
        if (!filled) return null
        return (
          <rect
            key={idx}
            x={col * cellSize}
            y={row * cellSize}
            width={cellSize}
            height={cellSize}
            fill="#1e2a8a"
          />
        )
      })}
    </svg>
  )
}

function DocumentCard({ doc }: { doc: Document }) {
  const [showQr, setShowQr] = useState(false)
  const validity = formatValidUntil(doc.validUntil)
  const isExpired = validity === 'истёк'

  return (
    <Card className="h-full flex flex-col">
      <div className="flex items-start gap-3 mb-3">
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-soft text-navy shrink-0">
          <FileIcon className="w-5 h-5" />
        </span>
        <div className="min-w-0">
          <h3 className="font-semibold text-navy-deep leading-snug">{doc.title}</h3>
          <div className="text-xs text-muted mt-0.5">{doc.issuer}</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        <Badge variant="code">{doc.format.toUpperCase()}</Badge>
        <Badge variant="default">{doc.sizeKb} КБ</Badge>
        {validity && (
          <Badge variant={isExpired ? 'need-id' : 'accent'}>{validity}</Badge>
        )}
      </div>

      <div className="text-xs text-muted mb-4 flex-1">
        Выдан {formatWhen(doc.issuedAt)}
        {doc.applicationNum && (
          <>
            {' '}· по заявлению № {doc.applicationNum}
          </>
        )}
      </div>

      {showQr ? (
        <div className="border-t border-line pt-3 flex flex-col items-center gap-2">
          <FakeQr payload={doc.qrPayload} size={140} />
          <p className="text-[11px] text-muted text-center">
            Покажите QR-код для проверки подлинности
          </p>
        </div>
      ) : (
        <div className="border-t border-line pt-3 flex gap-2">
          <button
            type="button"
            onClick={() => alert('В демо скачивание недоступно')}
            className="flex-1 inline-flex items-center justify-center rounded-control min-h-9 text-sm font-semibold bg-navy text-white hover:bg-navy-deep"
          >
            Скачать
          </button>
          <button
            type="button"
            onClick={() => setShowQr(true)}
            className="flex-1 inline-flex items-center justify-center rounded-control min-h-9 text-sm font-semibold border border-navy text-navy hover:bg-soft"
          >
            QR-код
          </button>
        </div>
      )}
    </Card>
  )
}

type ViewState = 'idle' | 'loading'

export function DocsTab() {
  const [query, setQuery] = useState('')
  const [viewState] = useState<ViewState>('idle')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return mockDocuments
    return mockDocuments.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        d.issuer.toLowerCase().includes(q) ||
        (d.applicationNum ?? '').includes(q),
    )
  }, [query])

  if (viewState === 'loading') return <SkeletonList rows={3} />

  return (
    <div>
      <div className="mb-4">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Поиск по названию, ведомству или номеру заявления"
          className="w-full h-11 rounded-control border border-line px-3 text-[15px] outline-none focus:border-navy focus:ring-4 focus:ring-navy/12"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<FileIcon className="w-12 h-12" />}
          title="Документов пока нет"
          description="Справки и выписки появятся здесь, как только ведомство окажет услугу."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((d) => (
            <DocumentCard key={d.id} doc={d} />
          ))}
        </div>
      )}

      <div className="mt-6 flex items-start gap-2 text-xs text-muted">
        <InfoIcon className="w-4 h-4 shrink-0 mt-0.5" />
        <span>
          QR-код ведёт на страницу проверки документа. В демо-режиме он декоративный.
        </span>
      </div>
    </div>
  )
}