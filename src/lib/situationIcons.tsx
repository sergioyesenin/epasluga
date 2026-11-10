import type { JSX } from 'react'

/**
 * Единый набор линейных SVG-иконок для жизненных ситуаций.
 * Заменяет эмодзи: 24×24, stroke=currentColor, как в CategoryGrid.
 */
const PATHS: Record<string, JSX.Element> = {
  birth: (
    <>
      <circle cx="12" cy="8" r="3.2" />
      <path d="M6 20c0-3 2.5-5 6-5s6 2 6 5" />
      <path d="M9 14.5 7 18M15 14.5 17 18" />
    </>
  ),
  'buy-car': (
    <>
      <path d="M5 16h14l-1-5H6l-1 5Z" />
      <circle cx="8" cy="16" r="1.2" />
      <circle cx="16" cy="16" r="1.2" />
      <path d="M7 11l1.5-3h7L17 11" />
    </>
  ),
  university: (
    <>
      <path d="M3 9l9-4 9 4-9 4-9-4Z" />
      <path d="M7 11v5c2 1.5 8 1.5 10 0v-5" />
      <path d="M21 9v6" />
    </>
  ),
  kindergarten: (
    <>
      <path d="M5 20V10l7-5 7 5v10" />
      <path d="M9 20v-6h6v6" />
      <circle cx="12" cy="8" r="1.2" />
    </>
  ),
  retirement: (
    <>
      <circle cx="12" cy="8" r="3" />
      <path d="M5 20c1.5-3 4-4.5 7-4.5s5.5 1.5 7 4.5" />
      <path d="M16 5l4-2M18 9h4" />
    </>
  ),
  'start-business': (
    <>
      <rect x="4" y="8" width="16" height="11" rx="2" />
      <path d="M9 8V7a3 3 0 0 1 6 0v1" />
      <path d="M4 13h16" />
    </>
  ),
  'real-estate': (
    <>
      <path d="m4 11 8-7 8 7v9H4v-9Z" />
      <path d="M10 20v-5h4v5" />
    </>
  ),
  'change-residence': (
    <>
      <path d="M4 7h10l-3-3M20 17H10l3 3" />
      <path d="M4 7v10M20 17V7" />
    </>
  ),
  'loss-of-relative': (
    <>
      <path d="M12 3v12M8 9l4 4 4-4" />
      <path d="M5 19h14" />
    </>
  ),
  'lost-documents': (
    <>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <circle cx="9" cy="12" r="2" />
      <path d="M13 11h5M13 14h4" />
    </>
  ),
}

const FALLBACK = (
  <>
    <rect x="5" y="4" width="14" height="16" rx="2" />
    <path d="M9 9h6M9 13h6M9 17h4" />
  </>
)

export function SituationIcon({
  id,
  className = 'w-6 h-6',
}: {
  id: string
  className?: string
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {PATHS[id] ?? FALLBACK}
    </svg>
  )
}