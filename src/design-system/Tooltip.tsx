import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import clsx from 'clsx'

type TooltipProps = {
  text: string
  children: ReactNode
  className?: string
}

export function Tooltip({ text, children, className }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const triggerRef = useRef<HTMLSpanElement>(null)
  const [coords, setCoords] = useState({ top: 0, left: 0 })
  const tooltipId = useId()

  // Подсказку можно скрыть Esc, не уводя мышь и фокус (WCAG 1.4.13)
  useEffect(() => {
    if (!isVisible) {
      return
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsVisible(false)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
    }
  }, [isVisible])

  const show = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      setCoords({ top: rect.top - 8, left: rect.left + rect.width / 2 })
      setIsVisible(true)
    }
  }

  return (
    <>
      <span
        ref={triggerRef}
        onMouseEnter={show}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={show}
        onBlur={() => setIsVisible(false)}
        tabIndex={0}
        aria-describedby={tooltipId}
        // Пунктирное подчёркивание вместо иконки «?»
        className={clsx(
          // Подсказка стоит в светлых карточках: белое подчёркивание там было невидимо
          'inline border-b border-dashed border-current cursor-help focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-navy',
          className,
        )}
      >
        {children}
      </span>

      {/* Текст всегда в DOM — его зачитывает экранный диктор через aria-describedby */}
      <div
        id={tooltipId}
        role="tooltip"
        hidden={!isVisible}
        className="fixed z-50 bg-[#1c1c28] text-white text-xs px-3 py-2 rounded-lg pointer-events-none max-w-xs shadow-lg -translate-x-1/2 -translate-y-full"
        style={{ top: coords.top, left: coords.left }}
      >
        {text}
      </div>
    </>
  )
}
