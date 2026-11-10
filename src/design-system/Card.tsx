import type { HTMLAttributes } from 'react'
import clsx from 'clsx'

type CardProps = HTMLAttributes<HTMLDivElement> & {
  variant?: 'default' | 'interactive'
}

export function Card({ variant = 'default', className, children, ...props }: CardProps) {
  return (
    <div
      className={clsx(
        'bg-card border border-line rounded-card p-4 shadow-card flex flex-col transition-all duration-150',
        variant === 'interactive' &&
          'cursor-pointer hover:border-navy hover:-translate-y-px hover:shadow-md active:scale-[0.995] active:border-navy-deep',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}