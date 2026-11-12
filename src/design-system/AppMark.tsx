/** Знак приложения — та же геометрия, что у иконки (scripts/make_icons.py). */
export function AppMark({ className = 'w-8 h-8' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 512 512" aria-hidden="true">
      <rect width="512" height="512" rx="112" fill="var(--color-navy-deep)" />
      <g fill="#fff">
        <rect x="156" y="136" width="48" height="240" rx="24" />
        <rect x="156" y="136" width="200" height="48" rx="24" />
        <rect x="156" y="232" width="128" height="48" rx="24" />
        <rect x="156" y="328" width="200" height="48" rx="24" />
      </g>
      <circle cx="332" cy="256" r="24" fill="var(--color-family-orange)" />
    </svg>
  )
}
