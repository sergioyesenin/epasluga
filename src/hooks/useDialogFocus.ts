import { useEffect, useRef, type RefObject } from 'react'

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

function focusables(box: HTMLElement): HTMLElement[] {
  return [...box.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
    (el) => el.offsetParent !== null || el === document.activeElement,
  )
}

/**
 * Фокус в модальном окне:
 *  - при открытии — на первое поле ввода (или первую кнопку);
 *  - Tab и Shift+Tab не выходят за пределы окна (ловушка фокуса);
 *  - Esc закрывает;
 *  - после закрытия фокус возвращается туда, откуда окно открыли.
 */
export function useDialogFocus(
  boxRef: RefObject<HTMLElement | null>,
  open: boolean,
  onClose: () => void,
) {
  // Последний onClose без перезапуска эффекта: иначе фокус прыгал бы при каждом рендере
  const closeRef = useRef(onClose)

  useEffect(() => {
    closeRef.current = onClose
  }, [onClose])

  useEffect(() => {
    if (!open) {
      return
    }
    const box = boxRef.current
    if (!box) {
      return
    }
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null

    const first =
      box.querySelector<HTMLElement>('input:not([disabled]), select, textarea') ??
      focusables(box)[0] ??
      box
    first.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        closeRef.current()
        return
      }
      if (e.key !== 'Tab') {
        return
      }
      const items = focusables(box)
      if (items.length === 0) {
        e.preventDefault()
        return
      }
      const firstItem = items[0]
      const lastItem = items[items.length - 1]
      const active = document.activeElement
      if (e.shiftKey && (active === firstItem || !box.contains(active))) {
        e.preventDefault()
        lastItem.focus()
      } else if (!e.shiftKey && (active === lastItem || !box.contains(active))) {
        e.preventDefault()
        firstItem.focus()
      }
    }

    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      // Вернуть фокус, если кнопка-открывашка ещё на странице
      if (opener && opener.isConnected) {
        opener.focus()
      }
    }
  }, [open, boxRef])
}
