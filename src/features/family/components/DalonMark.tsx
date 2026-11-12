/** Знак «Далони»: ладонь из пяти пальцев — пять членов семьи. */
export function DalonMark({ className = 'w-10 h-10' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="currentColor" aria-hidden="true">
      <rect x="4" y="15" width="6" height="14" rx="3" transform="rotate(-18 7 22)" />
      <rect x="11.5" y="5" width="6" height="22" rx="3" />
      <rect x="18.5" y="3" width="6" height="24" rx="3" />
      <rect x="25.5" y="5.5" width="6" height="21.5" rx="3" />
      <rect x="32" y="10" width="5.5" height="17" rx="2.75" />
      <rect x="9" y="22" width="29" height="15" rx="7.5" />
    </svg>
  )
}
