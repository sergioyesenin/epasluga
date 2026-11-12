import type { HTMLAttributes } from 'react'
import clsx from 'clsx'

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: 'default' | 'need-id' | 'ecp' | 'code' | 'accent'
}

export function Badge({ variant = 'default', className, children, ...props }: BadgeProps) {
  return (
    <span
      className={clsx(
        // inline-flex, items-center, whitespace-nowrap — чтобы длинные подписи
        // («Нужна ID-карта») не рвались на две строки внутри бейджа.
        // Регистр обычный: капслок в мелких метках читается хуже.
        'inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1',
        'text-xs font-semibold leading-none',
        variant === 'default' && 'bg-soft text-muted',
        variant === 'need-id' && 'bg-[#fdecea] text-danger',
        variant === 'ecp' && 'bg-[#fff4e5] text-accent-warm',
        variant === 'code' && 'bg-soft text-muted tabular',
        variant === 'accent' && 'bg-[#e7f6f2] text-accent',
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}