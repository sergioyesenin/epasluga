import { useMemo, useState } from 'react'
import { Badge, EmptyState } from '../../../design-system'
import { mockMail } from '../../../data/mockMail'
import { formatWhen } from '../../../lib/format'
import {
  FileIcon,
  InfoIcon,
  ShieldCheckIcon,
  CheckIcon,
} from '../../../lib/situationIcons'
import type { MailMessage } from '../../../types/service'
import clsx from 'clsx'

type Box = 'in' | 'out'
type Filter = 'all' | 'unread' | 'action'

function actionLabel(a: MailMessage['actionRequired']): string | null {
  if (a === 'sign') return 'Требуется подпись'
  if (a === 'pay') return 'Требуется оплата'
  if (a === 'provide') return 'Нужны документы'
  return null
}

export function MailTab() {
  const [box, setBox] = useState<Box>('in')
  const [filter, setFilter] = useState<Filter>('all')
  const [read, setRead] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(mockMail.map((m) => [m.id, m.read])),
  )
  const [selected, setSelected] = useState<MailMessage | null>(null)

  const rows = useMemo(() => {
    return mockMail
      .filter((m) => m.direction === box)
      .filter((m) => {
        if (filter === 'unread') return !read[m.id]
        if (filter === 'action') return !!m.actionRequired
        return true
      })
      .sort((a, b) => (a.at < b.at ? 1 : -1))
  }, [box, filter, read])

  const unreadCount = (side: Box) =>
    mockMail.filter((m) => m.direction === side && !read[m.id]).length

  const actionCount = (side: Box) =>
    mockMail.filter((m) => m.direction === side && m.actionRequired).length

  const open = (m: MailMessage) => {
    setRead((prev) => ({ ...prev, [m.id]: true }))
    setSelected(m)
  }

  if (selected) {
    const act = actionLabel(selected.actionRequired)
    return (
      <div>
        <button
          type="button"
          onClick={() => setSelected(null)}
          className="text-sm text-navy hover:underline mb-4"
        >
          ← К списку
        </button>

        <div className="bg-white border border-line rounded-card overflow-hidden">
          {/* Шапка сообщения */}
          <div className="p-5 border-b border-line bg-[#f8f9ff]">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge variant={selected.direction === 'in' ? 'default' : 'accent'}>
                {selected.direction === 'in' ? 'От ведомства' : 'От вас'}
              </Badge>
              {selected.signatureVerified && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-ok bg-[#e6f6ec] px-2 py-1 rounded-full">
                  <ShieldCheckIcon className="w-3.5 h-3.5" />
                  Подписано ЭЦП
                </span>
              )}
              {act && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-accent-warm bg-[#fff4e5] px-2 py-1 rounded-full">
                  <InfoIcon className="w-3.5 h-3.5" />
                  {act}
                </span>
              )}
              <span className="text-xs text-muted ml-auto">{formatWhen(selected.at)}</span>
            </div>
            <h2 className="text-xl font-bold text-navy-deep mb-1">{selected.subject}</h2>
            <div className="text-sm text-muted">
              {selected.direction === 'in' ? 'От: ' : 'Кому: '}
              <b className="text-ink">{selected.agency}</b>
              {selected.agencyUnp && (
                <>
                  {' '}· УНП {selected.agencyUnp}
                </>
              )}
              {selected.applicationNum && (
                <>
                  {' '}· Заявление № {selected.applicationNum}
                </>
              )}
            </div>
          </div>

          {/* Сопроводительный текст */}
          <div className="p-5 border-b border-line">
            <p className="text-[15px] text-ink whitespace-pre-line">{selected.summary}</p>
          </div>

          {/* Вложения */}
          {selected.attachments.length > 0 && (
            <div className="p-5 border-b border-line">
              <h3 className="text-sm font-bold text-navy-deep mb-3">
                Документы в сообщении
              </h3>
              <ul className="space-y-2">
                {selected.attachments.map((att) => (
                  <li
                    key={att.id}
                    className="flex items-center gap-3 p-3 border border-line rounded-control"
                  >
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-soft text-navy shrink-0">
                      <FileIcon className="w-5 h-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-navy-deep truncate">
                        {att.name}
                      </div>
                      <div className="text-xs text-muted flex items-center gap-2 flex-wrap">
                        <span>{att.format.toUpperCase()}</span>
                        <span>· {att.sizeKb} КБ</span>
                        {att.signed ? (
                          <span className="inline-flex items-center gap-1 text-ok">
                            <CheckIcon className="w-3 h-3" />
                            подписан
                          </span>
                        ) : (
                          <span className="text-danger">не подписан</span>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => alert('В демо скачивание недоступно')}
                      className="shrink-0 inline-flex items-center justify-center rounded-control min-h-9 px-3 text-sm font-semibold bg-navy text-white hover:bg-navy-deep"
                    >
                      Скачать
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Подпись */}
          {selected.signatureVerified && (
            <div className="p-4 text-xs text-muted bg-soft/50 flex items-start gap-2">
              <ShieldCheckIcon className="w-4 h-4 text-ok shrink-0 mt-0.5" />
              <span>
                Подлинность подтверждена электронной цифровой подписью
                {selected.signedAt ? `, ${formatWhen(selected.signedAt)}` : ''}. Документ
                имеет юридическую силу без бумажной копии.
              </span>
            </div>
          )}

          {/* Действия */}
          <div className="p-5 flex flex-wrap gap-2 border-t border-line">
            {selected.actionRequired === 'sign' && (
              <button
                type="button"
                onClick={() => alert('В демо подпись недоступна')}
                className="inline-flex items-center justify-center rounded-control px-4 min-h-11 text-sm font-semibold bg-navy text-white hover:bg-navy-deep"
              >
                Подписать и отправить
              </button>
            )}
            {selected.actionRequired === 'pay' && (
              <button
                type="button"
                onClick={() => alert('В демо оплата недоступна')}
                className="inline-flex items-center justify-center rounded-control px-4 min-h-11 text-sm font-semibold bg-navy text-white hover:bg-navy-deep"
              >
                Перейти к оплате
              </button>
            )}
            {selected.actionRequired === 'provide' && (
              <button
                type="button"
                onClick={() => alert('В демо загрузка документов недоступна')}
                className="inline-flex items-center justify-center rounded-control px-4 min-h-11 text-sm font-semibold bg-navy text-white hover:bg-navy-deep"
              >
                Загрузить документы
              </button>
            )}
            <button
              type="button"
              onClick={() => alert('В демо архив недоступен')}
              className="inline-flex items-center justify-center rounded-control px-4 min-h-11 text-sm font-semibold border border-navy text-navy hover:bg-soft"
            >
              В архив
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Пояснение */}
      <div className="mb-4 flex items-start gap-2 text-xs text-muted bg-soft/70 border border-line rounded-control p-3">
        <ShieldCheckIcon className="w-4 h-4 shrink-0 mt-0.5 text-navy" />
        <span>
          «Почта гражданина» — защищённый канал обмена юридически значимыми документами
          с госорганами. Все сообщения подписаны ЭЦП и имеют юридическую силу.
        </span>
      </div>

      {/* Переключатели */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="inline-flex bg-soft rounded-full p-1">
          {(
            [
              ['in', 'От ведомств'],
              ['out', 'От вас'],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => {
                setBox(value)
                setFilter('all')
              }}
              className={clsx(
                'px-4 py-2 rounded-full text-sm font-semibold transition-colors',
                box === value
                  ? 'bg-white text-navy shadow-sm'
                  : 'text-muted hover:text-navy',
              )}
            >
              {label}
              {unreadCount(value) > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center min-w-5 h-5 px-1 rounded-full bg-navy text-white text-[10px] font-bold">
                  {unreadCount(value)}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="ml-auto flex gap-1">
          {(
            [
              ['all', 'Все'],
              ['unread', 'Непрочитанные'],
              ['action', 'Требуют действия'],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              className={clsx(
                'px-3 py-1.5 rounded-full text-xs font-semibold transition-colors',
                filter === value
                  ? 'bg-navy text-white'
                  : 'bg-white text-navy border border-line hover:border-navy',
              )}
            >
              {label}
              {value === 'action' && actionCount(box) > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center min-w-4 h-4 px-1 rounded-full bg-accent-warm text-white text-[10px] font-bold">
                  {actionCount(box)}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {rows.length === 0 ? (
        <EmptyState
          icon={<InfoIcon className="w-12 h-12" />}
          title={box === 'in' ? 'Нет сообщений от ведомств' : 'Нет ваших исходящих'}
          description={
            filter === 'unread'
              ? 'Все сообщения прочитаны.'
              : filter === 'action'
                ? 'Нет сообщений, требующих действия.'
                : box === 'in'
                  ? 'Сюда будут приходить официальные ответы и документы по заявлениям.'
                  : 'Отправленные заявления и документы будут храниться здесь.'
          }
        />
      ) : (
        <div className="bg-white border border-line rounded-card divide-y divide-line overflow-hidden">
          {rows.map((m) => {
            const act = actionLabel(m.actionRequired)
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => open(m)}
                className="w-full text-left p-4 flex gap-3 hover:bg-soft/50 transition-colors"
              >
                <span
                  className={clsx(
                    'shrink-0 w-10 h-10 rounded-xl flex items-center justify-center',
                    m.actionRequired
                      ? 'bg-[#fff4e5] text-accent-warm'
                      : 'bg-[#e8eeff] text-navy',
                  )}
                >
                  {m.actionRequired ? (
                    <InfoIcon className="w-5 h-5" />
                  ) : (
                    <ShieldCheckIcon className="w-5 h-5" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span
                      className={clsx(
                        'font-semibold text-navy-deep truncate',
                        !read[m.id] && 'font-bold',
                      )}
                    >
                      {m.subject}
                    </span>
                    {!read[m.id] && (
                      <span
                        className="w-2 h-2 rounded-full bg-navy shrink-0"
                        aria-label="Непрочитанное"
                      />
                    )}
                    {act && (
                      <span className="text-[10px] uppercase tracking-wider font-bold text-accent-warm bg-[#fff4e5] px-1.5 py-0.5 rounded">
                        {act}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted mb-1">
                    {m.agency} · {formatWhen(m.at)}
                    {m.attachments.length > 0 && (
                      <>
                        {' '}· {m.attachments.length}{' '}
                        {m.attachments.length === 1 ? 'документ' : 'документов'}
                      </>
                    )}
                  </div>
                  <div className="text-sm text-muted line-clamp-2">{m.summary}</div>
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}