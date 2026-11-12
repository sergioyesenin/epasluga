import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input, Modal } from '../../../design-system'
import { addPerson } from '../../../lib/dalon/actions'
import { showToast } from '../../../lib/toast'
import { actionButton, quietButton } from '../components/styles'

const RELATIONS = ['Мать', 'Отец', 'Брат или сестра', 'Взрослый сын или дочь', 'Другой родственник']

const schema = z.object({
  full: z
    .string()
    .trim()
    .regex(
      /^[А-ЯЁЎІа-яёўі-]{2,}\s+[А-ЯЁЎІа-яёўі-]{2,}/,
      'Укажите хотя бы фамилию и имя кириллицей',
    ),
  relation: z.string(),
  idn: z
    .string()
    .trim()
    .transform((v) => v.toUpperCase())
    .pipe(
      z.string().regex(/^[0-9A-Z]{14}$/, 'Личный номер — 14 цифр и латинских букв, как в паспорте'),
    ),
})

type FormInput = z.input<typeof schema>
type FormOutput = z.output<typeof schema>

type AddPersonDialogProps = {
  open: boolean
  onClose: () => void
}

/** Добавить взрослого: уходит запрос на согласие в его кабинет. */
export function AddPersonDialog({ open, onClose }: AddPersonDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormInput, unknown, FormOutput>({
    resolver: zodResolver(schema),
    defaultValues: { full: '', relation: RELATIONS[0], idn: '' },
  })

  const close = () => {
    reset()
    onClose()
  }

  const onSubmit = (data: FormOutput) => {
    const person = addPerson({ full: data.full, relation: data.relation })
    showToast({
      tone: 'ok',
      message: `Запрос отправлен: ${person.name}. Доступ появится после согласия.`,
    })
    close()
  }

  return (
    <Modal open={open} title="Добавить взрослого" onClose={close}>
      <p className="text-sm text-muted mb-5">
        Мы отправим запрос в его кабинет Е-Паслуги. Пока человек не согласится, вы ничего о нём не
        увидите.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div>
          <label htmlFor="add-full" className="block text-sm font-semibold text-ink mb-1.5">
            Фамилия, имя, отчество
          </label>
          <Input
            id="add-full"
            autoComplete="off"
            placeholder="Иванова Нина Петровна"
            isError={Boolean(errors.full)}
            aria-invalid={Boolean(errors.full)}
            aria-describedby={errors.full ? 'add-full-err' : undefined}
            className="min-h-11"
            {...register('full')}
          />
          {errors.full && (
            <p id="add-full-err" className="text-xs text-danger mt-1">
              {errors.full.message}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="add-rel" className="block text-sm font-semibold text-ink mb-1.5">
            Кем приходится
          </label>
          <select
            id="add-rel"
            className="w-full min-h-11 rounded-control border border-line bg-white px-3 text-[15px] focus:border-navy focus:outline-none focus:ring-4 focus:ring-navy/12"
            {...register('relation')}
          >
            {RELATIONS.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="add-idn" className="block text-sm font-semibold text-ink mb-1.5">
            Личный номер
          </label>
          <Input
            id="add-idn"
            autoComplete="off"
            maxLength={14}
            placeholder="14 символов, как в паспорте"
            isError={Boolean(errors.idn)}
            aria-invalid={Boolean(errors.idn)}
            aria-describedby={errors.idn ? 'add-idn-err' : undefined}
            className="min-h-11 uppercase tabular"
            {...register('idn')}
          />
          {errors.idn && (
            <p id="add-idn-err" className="text-xs text-danger mt-1">
              {errors.idn.message}
            </p>
          )}
        </div>
        <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
          <button type="button" className={quietButton} onClick={close}>
            Отмена
          </button>
          <button type="submit" className={actionButton}>
            Отправить запрос
          </button>
        </div>
      </form>
    </Modal>
  )
}
