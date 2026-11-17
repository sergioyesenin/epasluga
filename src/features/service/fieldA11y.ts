import type { FieldError } from 'react-hook-form'

/** aria-атрибуты поля с ошибкой: экранный диктор зачитает текст ошибки вместе с полем. */
export function errorProps(name: string, error?: FieldError) {
  return {
    'aria-invalid': error ? true : undefined,
    'aria-describedby': error ? `${name}-error` : undefined,
  }
}
