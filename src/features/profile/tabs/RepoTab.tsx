import { useMemo, useState } from 'react'
import { Badge, Card, EmptyState } from '../../../design-system'
import { mockRepository } from '../../../data/mockRepository'
import { formatWhen } from '../../../lib/format'
import { FileIcon, InfoIcon } from '../../../lib/situationIcons'
import type { RepositoryFile } from '../../../types/service'

function formatSize(kb: number): string {
  if (kb < 1024) return `${kb} КБ`
  return `${(kb / 1024).toFixed(1)} МБ`
}

export function RepoTab() {
  const [files, setFiles] = useState<RepositoryFile[]>(mockRepository)
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return files
    return files.filter((f) => f.name.toLowerCase().includes(q))
  }, [files, query])

  const handleUpload = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.onchange = () => {
      const file = input.files?.[0]
      if (!file) return
      const next: RepositoryFile = {
        id: `f-${Date.now()}`,
        name: file.name,
        format: file.name.endsWith('.pdf')
          ? 'pdf'
          : file.name.endsWith('.zip')
            ? 'zip'
            : 'xml',
        sizeKb: Math.round(file.size / 1024),
        uploadedAt: new Date().toISOString(),
      }
      setFiles((prev) => [next, ...prev])
    }
    input.click()
  }

  const handleDelete = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center mb-4">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Поиск по имени файла"
          className="flex-1 h-11 rounded-control border border-line px-3 text-[15px] outline-none focus:border-navy focus:ring-4 focus:ring-navy/12"
        />
        <button
          type="button"
          onClick={handleUpload}
          className="inline-flex items-center justify-center rounded-control px-4 min-h-11 text-sm font-semibold bg-navy text-white hover:bg-navy-deep"
        >
          Загрузить файл
        </button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<FileIcon className="w-12 h-12" />}
          title={files.length === 0 ? 'Репозиторий пуст' : 'Ничего не найдено'}
          description={
            files.length === 0
              ? 'Загружайте документы, чтобы прикреплять их к заявлениям без повторной загрузки.'
              : 'Попробуйте изменить запрос.'
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map((f) => (
            <Card key={f.id} className="flex flex-col">
              <div className="flex items-start gap-3 mb-3">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-soft text-navy shrink-0">
                  <FileIcon className="w-5 h-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-ink truncate" title={f.name}>
                    {f.name}
                  </div>
                  <div className="text-xs text-muted">
                    {formatSize(f.sizeKb)} · загружен {formatWhen(f.uploadedAt)}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-3">
                <Badge variant="code">{f.format.toUpperCase()}</Badge>
                {f.attachedTo && <Badge variant="accent">{f.attachedTo}</Badge>}
              </div>

              <div className="mt-auto border-t border-line pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => alert('В демо скачивание недоступно')}
                  className="flex-1 inline-flex items-center justify-center rounded-control min-h-9 text-sm font-semibold border border-navy text-navy hover:bg-soft"
                >
                  Скачать
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(f.id)}
                  className="inline-flex items-center justify-center rounded-control min-h-9 px-3 text-sm font-semibold text-danger border border-danger/40 hover:bg-[#fff6f6]"
                >
                  Удалить
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-6 flex items-start gap-2 text-xs text-muted">
        <InfoIcon className="w-4 h-4 shrink-0 mt-0.5" />
        <span>
          Файлы хранятся в вашем кабинете и доступны при оформлении заявлений. В демо
          загрузка симулируется.
        </span>
      </div>
    </div>
  )
}