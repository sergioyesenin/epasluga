import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button, Card, Input } from '../../design-system'
import type { Service } from '../../types/service'
import { SuccessScreen } from './SuccessScreen'
import { newApplicationIds, useApplications } from '../../lib/applications'
import { CheckIcon } from '../../lib/situationIcons'
import { isRecord, readJson, removeKey, writeJson } from '../../lib/storage'
import { FieldError } from './FieldError'
import { errorProps } from './fieldA11y'

// Без JIT-компиляции схем через new Function: CSP запрещает eval ('unsafe-eval' убран)
z.config({ jitless: true })

// Схема валидации (эвристика #9 — понятные сообщения рядом с полем)
const PHONE_RE = /^\+375\s?\(?(?:17|25|29|33|44)\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/

const schema = z.object({
  lastName: z.string().trim().min(2, 'Укажите фамилию, минимум 2 буквы'),
  firstName: z.string().trim().min(2, 'Укажите имя, минимум 2 буквы'),
  middleName: z.string().trim().optional().or(z.literal('')),
  phone: z.string().trim().regex(PHONE_RE, 'Формат: +375 29 000-00-00'),
  email: z.string().trim().email('Похоже на неверный адрес').optional().or(z.literal('')),
  comment: z.string().max(500, 'Не больше 500 символов').optional().or(z.literal('')),
  consent: z.literal(true, {
    error: () => ({ message: 'Нужно согласие, чтобы отправить заявление' }),
  }),
})

type FormData = z.infer<typeof schema>

const DRAFT_PREFIX = 'epasluga-draft:'

function isDraft(value: unknown): value is Partial<FormData> {
  return isRecord(value) && Object.values(value).every((v) => v === undefined || typeof v === 'string')
}

function readDraft(id: string): Partial<FormData> | null {
  return readJson<Partial<FormData> | null>(DRAFT_PREFIX + id, null, isDraft)
}

/** Черновик без галочки согласия: согласие даётся заново при каждой отправке. */
function saveDraft(id: string, values: Partial<FormData>) {
  const draft = { ...values }
  delete draft.consent
  writeJson(DRAFT_PREFIX + id, draft)
}

const timeNow = () => new Date().toLocaleTimeString('ru-BY', { hour: '2-digit', minute: '2-digit' })

type ApplicationFormProps = {
  service: Service
  onBack: () => void
  situationId?: string
  situationStepId?: string
}

export function ApplicationForm({
  service,
  onBack,
  situationId,
  situationStepId,
}: ApplicationFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false)
  // Черновик читаем один раз при открытии формы — он же становится значениями по умолчанию
  const [savedDraft] = useState(() => readDraft(service.id))
  const [draftStatus, setDraftStatus] = useState<string | null>(
    savedDraft ? 'Черновик восстановлен' : null,
  )
  const [generatedNum, setGeneratedNum] = useState<string>('')
  const saveTimer = useRef<number | null>(null)
  const { add } = useApplications()

  const {
    register,
    handleSubmit,
    subscribe,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    defaultValues: {
      lastName: '',
      firstName: '',
      middleName: '',
      phone: '',
      email: '',
      comment: '',
      ...savedDraft,
    },
  })

  // Автосохранение черновика: подписка без перерисовки формы на каждый символ
  useEffect(() => {
    const unsubscribe = subscribe({
      formState: { values: true },
      callback: ({ values }) => {
        if (saveTimer.current) {
          window.clearTimeout(saveTimer.current)
        }
        saveTimer.current = window.setTimeout(() => {
          saveDraft(service.id, values)
          setDraftStatus(`Черновик сохранён ${timeNow()}`)
        }, 400)
      },
    })
    return () => {
      unsubscribe()
      if (saveTimer.current) {
        window.clearTimeout(saveTimer.current)
      }
    }
  }, [subscribe, service.id])

  const onSubmit = async (data: FormData) => {
    const { id, num } = newApplicationIds()
    setGeneratedNum(num)

    add({
      id,
      num,
      title: service.shortTitle,
      serviceId: service.id,
      initiator: service.orgName,
      status: 'На проверке',
      at: new Date().toISOString(),
      comment: data.comment || '',
      situationId,
      situationStepId,
    })

    removeKey(DRAFT_PREFIX + service.id)
    setIsSubmitted(true)
  }

  const onSaveAndExit = () => {
    saveDraft(service.id, getValues())
    onBack()
  }

  if (isSubmitted) {
    return (
      <SuccessScreen
        service={service}
        applicationNum={generatedNum}
        situationId={situationId}
      />
    )
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="text-sm text-muted mb-6">
        <button type="button" onClick={onBack} className="hover:text-navy">
          ← Вернуться к описанию
        </button>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink mb-2">Заполнение заявления</h1>
        <p className="text-muted">{service.shortTitle}</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <div>
            <label htmlFor="lastName" className="block text-sm font-semibold mb-1">
              Фамилия <span className="text-danger">*</span>
            </label>
            <Input
              id="lastName"
              {...register('lastName')}
              placeholder="Иванов"
              autoComplete="family-name"
              isError={!!errors.lastName}
              {...errorProps('lastName', errors.lastName)}
            />
            <FieldError name="lastName" error={errors.lastName} />
          </div>

          <div>
            <label htmlFor="firstName" className="block text-sm font-semibold mb-1">
              Имя <span className="text-danger">*</span>
            </label>
            <Input
              id="firstName"
              {...register('firstName')}
              placeholder="Алексей"
              autoComplete="given-name"
              isError={!!errors.firstName}
              {...errorProps('firstName', errors.firstName)}
            />
            <FieldError name="firstName" error={errors.firstName} />
          </div>

          <div>
            <label htmlFor="middleName" className="block text-sm font-semibold mb-1">
              Отчество
            </label>
            <Input
              id="middleName"
              {...register('middleName')}
              placeholder="Сергеевич"
              autoComplete="additional-name"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-semibold mb-1">
              Телефон <span className="text-danger">*</span>
            </label>
            <Input
              id="phone"
              {...register('phone')}
              placeholder="+375 29 123-45-67"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              isError={!!errors.phone}
              {...errorProps('phone', errors.phone)}
            />
            <FieldError name="phone" error={errors.phone} />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold mb-1">
              Электронная почта
            </label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              placeholder="example@mail.com"
              autoComplete="email"
              isError={!!errors.email}
              {...errorProps('email', errors.email)}
            />
            <FieldError name="email" error={errors.email} />
          </div>

          <div>
            <label htmlFor="comment" className="block text-sm font-semibold mb-1">
              Комментарий
            </label>
            <textarea
              id="comment"
              {...register('comment')}
              {...errorProps('comment', errors.comment)}
              placeholder="Дополнительная информация (необязательно)"
              className="w-full rounded-control border border-line px-3 py-2.5 text-[15px] outline-none focus:border-navy focus:ring-4 focus:ring-navy/12 min-h-24"
            />
            <FieldError name="comment" error={errors.comment} />
          </div>

          <div>
            <label className="flex gap-2 items-start text-sm">
              <input
                type="checkbox"
                {...register('consent')}
                {...errorProps('consent', errors.consent)}
                className="mt-0.5"
              />
              <span>
                Согласен на обработку персональных данных для оказания услуги.{' '}
                <span className="text-danger">*</span>
              </span>
            </label>
            <FieldError name="consent" error={errors.consent} />
          </div>

          <div className="pt-4 border-t border-line flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="text-sm text-ok font-semibold min-h-5">
              {draftStatus && (
                <span className="flex items-center gap-1.5" role="status">
                  <CheckIcon className="w-4 h-4" aria-hidden="true" />
                  {draftStatus}
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" type="button" onClick={onSaveAndExit}>
                Сохранить и выйти
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                Подписать и отправить
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  )
}