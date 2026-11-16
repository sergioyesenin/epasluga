import { useId, useState } from 'react'
import type { ReactNode } from 'react'
import clsx from 'clsx'

type AccordionProps = {
  title: string
  children: ReactNode
  defaultOpen?: boolean
}

export function Accordion({ title, children, defaultOpen = false }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const panelId = useId()

  return (
    <div className="border border-line rounded-control bg-white mb-2 overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="w-full flex items-center justify-between p-4 bg-transparent hover:bg-soft/50 transition-colors text-left font-semibold text-ink focus-visible:outline-3 focus-visible:-outline-offset-3 focus-visible:outline-navy"
      >
        <span>{title}</span>
        <svg aria-hidden="true"
          className={clsx('w-5 h-5 transition-transform duration-200', isOpen && 'rotate-180')}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div id={panelId} className="p-4 pt-0 text-[15px] text-muted border-t border-line/50">
          <div className="pt-4">{children}</div>
        </div>
      )}
    </div>
  )
}