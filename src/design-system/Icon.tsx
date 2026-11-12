import type { ReactNode } from 'react'

/**
 * Линейные иконки 24×24 с единой толщиной штриха.
 * Цвет — currentColor, размер — через className.
 */
const PATHS = {
  home: <path d="m4 11 8-7 8 7v9h-5v-6H9v6H4v-9Z" />,
  grid: (
    <>
      <rect x="4" y="4" width="7" height="7" rx="1.5" />
      <rect x="13" y="4" width="7" height="7" rx="1.5" />
      <rect x="4" y="13" width="7" height="7" rx="1.5" />
      <rect x="13" y="13" width="7" height="7" rx="1.5" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="3.4" />
      <path d="M5 20c1.4-3.3 4-5 7-5s5.6 1.7 7 5" />
    </>
  ),
  hand: (
    <path d="M8 13V6.5a1.5 1.5 0 0 1 3 0V12m0-6.5V4.5a1.5 1.5 0 0 1 3 0V12m0-6a1.5 1.5 0 0 1 3 0v6m0-3.5a1.5 1.5 0 0 1 3 0V15a6 6 0 0 1-6 6h-1.2a6 6 0 0 1-4.8-2.4L4.6 15a1.6 1.6 0 0 1 2.4-2.1L8 14" />
  ),
  bell: <path d="M6 16h12l-1.3-2.2V10a4.7 4.7 0 0 0-9.4 0v3.8L6 16Zm4 0a2 2 0 0 0 4 0" />,
  help: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M9.6 9.5a2.5 2.5 0 0 1 4.8.9c0 1.7-2.4 2.2-2.4 3.6M12 17h.01" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11v5M12 8h.01" />
    </>
  ),
  login: <path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4M10 16l4-4-4-4M14 12H4" />,
  logout: <path d="M10 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4M15 16l4-4-4-4M19 12H9" />,
  calendar: (
    <>
      <rect x="4" y="5.5" width="16" height="14.5" rx="2" />
      <path d="M4 10h16M8.5 3.5v4M15.5 3.5v4" />
    </>
  ),
  car: (
    <>
      <path d="M5 16.5V12l1.8-4.6A2 2 0 0 1 8.7 6h6.6a2 2 0 0 1 1.9 1.4L19 12v4.5" />
      <path d="M4 12h16v4.5H4z" />
      <path d="M6.5 16.5V19M17.5 16.5V19" />
      <circle cx="7.8" cy="14.2" r=".6" fill="currentColor" />
      <circle cx="16.2" cy="14.2" r=".6" fill="currentColor" />
    </>
  ),
  check: <path d="m5 12.5 4.2 4.2L19 7" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  download: <path d="M12 4v11m0 0-4.5-4.5M12 15l4.5-4.5M5 19.5h14" />,
  lock: (
    <>
      <rect x="5" y="10.5" width="14" height="9.5" rx="2" />
      <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  refresh: <path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3M19.5 4v4.5H15" />,
  shield: (
    <>
      <path d="M12 3.5 5 6.5v5.2c0 4.2 2.9 7.6 7 8.8 4.1-1.2 7-4.6 7-8.8V6.5l-7-3Z" />
      <path d="m9 12 2.2 2.2L15.5 10" />
    </>
  ),
  card: (
    <>
      <rect x="3.5" y="6" width="17" height="12.5" rx="2" />
      <path d="M3.5 10h17M7 15h3" />
    </>
  ),
  bank: <path d="M4 9.5 12 5l8 4.5M5.5 10v7M9.5 10v7M14.5 10v7M18.5 10v7M4 19.5h16" />,
  alert: (
    <>
      <path d="M12 4.5 20.5 19h-17L12 4.5Z" />
      <path d="M12 10v4M12 16.5h.01" />
    </>
  ),
  chevronLeft: <path d="m14.5 6-6 6 6 6" />,
  chevronRight: <path d="m9.5 6 6 6-6 6" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  share: <path d="M12 3.5v11M8 7.5l4-4 4 4M7 11H6a1.5 1.5 0 0 0-1.5 1.5v6A1.5 1.5 0 0 0 6 20h12a1.5 1.5 0 0 0 1.5-1.5v-6A1.5 1.5 0 0 0 18 11h-1" />,
  addSquare: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="3.5" />
      <path d="M12 8.5v7M8.5 12h7" />
    </>
  ),
  phone: (
    <>
      <rect x="7" y="3" width="10" height="18" rx="2.2" />
      <path d="M11 17.5h2" />
    </>
  ),
  offline: <path d="M3.5 9a13 13 0 0 1 4-2.4M20.5 9A13 13 0 0 0 11 5.6M6.5 12.4a8.5 8.5 0 0 1 2.7-1.6M17.5 12.4a8.4 8.4 0 0 0-2.3-1.4M9.8 15.6a3.8 3.8 0 0 1 4.4 0M12 19h.01M4 4l16 16" />,
  receipt: (
    <>
      <path d="M6 3.5h12v17l-2.4-1.5-2.4 1.5-2.4-1.5-2.4 1.5L6 20.5v-17Z" />
      <path d="M9 8h6M9 11.5h6M9 15h3.5" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </>
  ),
  file: <path d="M7 3.5h7l4.5 4.5v12.5H7V3.5Zm7 0V8h4.5" />,
  fingerprint: (
    <>
      <path d="M12 4c-3.9 0-7 3.1-7 7v2M19 13v-2c0-3.9-3.1-7-7-7" />
      <path d="M9 14v-3a3 3 0 1 1 6 0v4M12 11v6.5M9 17.5V20M15 17.5V20M5 16.5V18M19 16.5V18" />
    </>
  ),
  people: (
    <>
      <circle cx="9" cy="8.5" r="3" />
      <path d="M3.5 19c1-2.8 3-4.3 5.5-4.3s4.5 1.5 5.5 4.3" />
      <circle cx="16.5" cy="9.5" r="2.4" />
      <path d="M16 14.2c2.2 0 3.8 1.3 4.6 3.6" />
    </>
  ),
} satisfies Record<string, ReactNode>

export type IconName = keyof typeof PATHS

type IconProps = {
  name: IconName
  className?: string
  strokeWidth?: number
  title?: string
}

export function Icon({ name, className = 'w-5 h-5', strokeWidth = 1.8, title }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
    >
      {title && <title>{title}</title>}
      {PATHS[name]}
    </svg>
  )
}
