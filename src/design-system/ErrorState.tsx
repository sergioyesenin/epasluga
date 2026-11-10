import { Button } from './Button'

type Props = { title?: string; description?: string; onRetry: () => void }

export function ErrorState({
  title = 'Не удалось загрузить данные',
  description = 'Проверьте соединение и попробуйте ещё раз.',
  onRetry,
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-14 px-6 bg-white border border-dashed border-line rounded-card">
      <div className="w-12 h-12 rounded-full bg-[#fdecea] text-danger flex items-center justify-center mb-4">
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v4m0 4h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-bold text-navy-deep mb-2">{title}</h3>
      {description && <p className="text-sm text-muted max-w-md mb-6">{description}</p>}
      <Button onClick={onRetry}>Повторить</Button>
    </div>
  )
}