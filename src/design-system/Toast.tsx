import clsx from 'clsx'
import { useToasts } from '../hooks/useToasts'
import { dismissToast, type ToastItem } from '../lib/toast'

const toneDot: Record<ToastItem['tone'], string> = {
  info: 'bg-navy',
  ok: 'bg-ok',
  warn: 'bg-family-orange',
}

function ToastCard({ item }: { item: ToastItem }) {
  return (
    <div
      role="status"
      className="pointer-events-auto w-full sm:w-auto sm:min-w-80 max-w-md bg-ink text-white rounded-2xl shadow-lift pl-4 pr-2 py-2.5 flex items-center gap-3 animate-rise"
    >
      <span
        className={clsx('w-2 h-2 rounded-full shrink-0', toneDot[item.tone])}
        aria-hidden="true"
      />
      <div className="flex-1 min-w-0 py-1">
        {item.title && <p className="text-sm font-semibold leading-snug">{item.title}</p>}
        <p className="text-sm leading-snug text-white/85">{item.message}</p>
      </div>
      {item.action && (
        <button
          type="button"
          onClick={() => {
            item.action?.onClick()
            dismissToast(item.id)
          }}
          className="shrink-0 min-h-11 px-3 rounded-xl text-sm font-semibold text-white bg-white/12 hover:bg-white/20 transition-colors"
        >
          {item.action.label}
        </button>
      )}
      <button
        type="button"
        onClick={() => {
          dismissToast(item.id)
        }}
        className="shrink-0 w-11 h-11 inline-flex items-center justify-center rounded-xl text-white/70 hover:text-white hover:bg-white/10"
        aria-label="Закрыть сообщение"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}

/** Область всплывающих сообщений. Монтируется один раз в Layout. */
export function Toaster() {
  const items = useToasts()

  return (
    <div
      aria-live="polite"
      className="fixed inset-x-0 z-[60] px-4 flex flex-col items-center gap-2 pointer-events-none bottom-[calc(4.75rem+env(safe-area-inset-bottom))] md:bottom-6"
    >
      {items.map((item) => (
        <ToastCard key={item.id} item={item} />
      ))}
    </div>
  )
}
