import type { FieldError as RhfFieldError } from 'react-hook-form'

type FieldErrorProps = {
  name: string
  error?: RhfFieldError
}

/** Сообщение об ошибке под полем. С полем связывается через errorProps() из fieldA11y. */
export function FieldError({ name, error }: FieldErrorProps) {
  if (!error?.message) {
    return null
  }
  return (
    <p id={`${name}-error`} role="alert" className="text-danger text-xs mt-1">
      {error.message}
    </p>
  )
}
