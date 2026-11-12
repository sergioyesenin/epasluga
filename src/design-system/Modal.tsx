import { useEffect, useRef, type ReactNode } from 'react'
import { Icon } from './Icon'

type ModalProps = {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
}

/**
 * Диалог поверх страницы. На телефоне — лист снизу с учётом safe-area,
 * на компьютере — окно по центру. Закрывается Esc и кликом по фону.
 */
export function Modal({ open, title, onClose, children }: ModalProps) {
  const boxRef = useRef<HTMLDivElement>(null)
  // Последний onClose без перезапуска эффекта: иначе фокус прыгал бы при каждом рендере
  const closeRef = useRef(onClose)

  useEffect(() => {
    closeRef.current = onClose
  }, [onClose])

  useEffect(() => {
    if (!open) {
      return
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeRef.current()
      }
    }
    window.addEventListener('keydown', onKey)
    const box = boxRef.current
    const first =
      box?.querySelector<HTMLElement>('input, select, textarea') ?? box?.querySelector<HTMLElement>('button')
    first?.focus()
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open])

  if (!open) {
    return null
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-ink/45 flex items-end sm:items-center justify-center sm:p-4 animate-fade"
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={boxRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="bg-card w-full sm:max-w-lg rounded-t-3xl sm:rounded-card shadow-2xl max-h-[92dvh] overflow-y-auto pb-[max(1.5rem,env(safe-area-inset-bottom))] animate-rise"
        onClick={(e) => {
          e.stopPropagation()
        }}
      >
        <div className="flex items-start justify-between gap-3 pl-6 pr-2 pt-2">
          <h2 id="modal-title" className="text-xl font-bold text-ink pt-4">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-11 h-11 mt-1 inline-flex items-center justify-center rounded-xl text-muted hover:text-ink hover:bg-soft"
            aria-label="Закрыть"
          >
            <Icon name="close" className="w-5 h-5" />
          </button>
        </div>
        <div className="px-6 pt-2">{children}</div>
      </div>
    </div>
  )
}
