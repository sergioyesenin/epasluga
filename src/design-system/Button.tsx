import type { ButtonHTMLAttributes } from 'react'
import clsx from 'clsx'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost' | 'danger'
  size?: 'md' | 'sm'
}

export function Button({ variant = 'primary', size = 'md', className, children, ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center rounded-control font-semibold transition-all duration-150',
        'focus:outline-none focus:ring-4 focus:ring-navy/20',
        'active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed',
        size === 'md' && 'px-4 min-h-11 text-[15px]',
        size === 'sm' && 'px-3 min-h-9 text-sm',
        variant === 'primary' && 'bg-navy text-white hover:bg-navy-deep',
        variant === 'ghost' && 'bg-white text-navy border border-navy hover:bg-soft',
        variant === 'danger' && 'bg-danger text-white hover:bg-[#8e1c13]',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}