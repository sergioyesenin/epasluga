import { useId, useRef } from 'react'
import { Button } from './Button'
import { useDialogFocus } from '../hooks/useDialogFocus'

type ConfirmDialogProps = {
  open: boolean
  title: string
  description: string
  confirmLabel: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
  isDanger?: boolean
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel = 'Отмена',
  onConfirm,
  onCancel,
  isDanger = false,
}: ConfirmDialogProps) {
  const boxRef = useRef<HTMLDivElement>(null)
  const titleId = useId()
  const descId = useId()
  // Esc, ловушка фокуса и возврат фокуса после закрытия
  useDialogFocus(boxRef, open, onCancel)

  if (!open) {
    return null
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-[#14163c]/50 flex items-center justify-center p-4"
      onClick={onCancel}
      role="presentation"
    >
      <div
        ref={boxRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className="bg-white rounded-card p-6 max-w-md w-full shadow-2xl"
        onClick={(e) => {
          e.stopPropagation()
        }}
      >
        <h2 id={titleId} className="text-lg font-bold text-ink mb-2">
          {title}
        </h2>
        <p id={descId} className="text-sm text-muted mb-6">
          {description}
        </p>
        <div className="flex gap-2 justify-end">
          <Button variant="ghost" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <button
            type="button"
            onClick={onConfirm}
            className={`inline-flex items-center justify-center rounded-control px-4 py-2.5 text-[15px] font-semibold text-white focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-navy ${
              isDanger ? 'bg-danger hover:bg-[#8e1c13]' : 'bg-navy hover:bg-navy-deep'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}