import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Badge, Card, Button, ConfirmDialog, EmptyState } from '../../../design-system'
import { DeviceSettingsCard } from '../DeviceSettingsCard'
import { xcComponents } from '../../../data/xcComponents'
import { lifeSituations } from '../../../data/situations'

const PERSONA = {
  fullName: 'Иванов Алексей Сергеевич',
  initials: 'АС',
  idNumber: '1140390A012PB8',
  birthDate: '14.03.1990',
  citizenship: 'Республика Беларусь',
  address: '220030, г. Минск, ул. Карла Маркса, д. 14, кв. 27',
  phone: '+375 29 555-12-34',
  email: 'a.ivanov@example.by',
}

export function DataTab() {
  const [confirmBlock, setConfirmBlock] = useState(false)

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-1 flex flex-col items-center text-center p-6 h-fit">
        <div className="w-24 h-24 bg-soft text-ink rounded-full flex items-center justify-center text-3xl font-bold mb-4">
          {PERSONA.initials}
        </div>
        <h2 className="text-xl font-bold text-ink mb-1">{PERSONA.fullName}</h2>
        <p className="text-sm text-muted mb-6">Гражданин РБ</p>
      </Card>

      <div className="md:col-span-2 space-y-6">
        <Card>
          <h3 className="text-lg font-bold text-ink mb-6 border-b border-line pb-2">
            Персональные данные
          </h3>
          <dl className="space-y-4 text-[15px]">
            <div className="grid grid-cols-3 gap-4">
              <dt className="text-muted">Личный номер</dt>
              <dd className="col-span-2 font-semibold text-ink">{PERSONA.idNumber}</dd>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <dt className="text-muted">Дата рождения</dt>
              <dd className="col-span-2 font-semibold text-ink">{PERSONA.birthDate}</dd>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <dt className="text-muted">Гражданство</dt>
              <dd className="col-span-2 font-semibold text-ink">{PERSONA.citizenship}</dd>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <dt className="text-muted">Адрес</dt>
              <dd className="col-span-2 font-semibold text-ink">{PERSONA.address}</dd>
            </div>
          </dl>
        </Card>

        <Card>
          <h3 className="text-lg font-bold text-ink mb-6 border-b border-line pb-2">
            Контакты
          </h3>
          <dl className="space-y-4 text-[15px]">
            <div className="grid grid-cols-3 gap-4">
              <dt className="text-muted">Телефон</dt>
              <dd className="col-span-2 font-semibold text-ink">{PERSONA.phone}</dd>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <dt className="text-muted">Email</dt>
              <dd className="col-span-2 font-semibold text-ink">{PERSONA.email}</dd>
            </div>
          </dl>
        </Card>

        <Card>
          <h3 className="text-lg font-bold text-ink mb-4">Сертификаты</h3>
          <EmptyState
            title="У вас пока нет сертификатов"
            description="Здесь будут отображаться ваши электронные подписи и ключи доступа."
          />
        </Card>

        <DeviceSettingsCard />

        <Card className="border-danger/30 bg-[#fffbfa]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-ink mb-1">
                Блокировка уникального идентификатора (УИ)
              </h3>
              <p className="text-sm text-muted">
                Временно заблокирует вход и оказание услуг. Разблокировка — только в службе
                «Одно окно».
              </p>
            </div>
            <Button
              variant="danger"
              className="shrink-0"
              onClick={() => setConfirmBlock(true)}
            >
              Заблокировать УИ
            </Button>
          </div>
        </Card>

        <Card>
          <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3 border-b border-line pb-2">
            <h3 className="text-lg font-bold text-ink">Сквозные компоненты</h3>
            <span className="text-xs text-muted">
              внутренняя информация — что улучшит все услуги сразу
            </span>
          </div>
          <p className="text-sm text-muted mb-4">
            Общие «кирпичи», на которых держатся все услуги. Чем больше компонентов
            готово, тем меньше шагов и бумаг в каждой отдельной ситуации.
          </p>
          <ul className="space-y-3">
            {xcComponents.map((xc) => {
              const situations = xc.affectedSituations
                .map((rid) => lifeSituations.find((s) => s.registryId === rid))
                .filter((s): s is NonNullable<typeof s> => Boolean(s))
              return (
                <li key={xc.id} className="border border-line rounded-control p-3">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <Badge variant="code">{xc.id}</Badge>
                    <span className="font-semibold text-ink text-sm">{xc.title}</span>
                    <Badge variant="default">
                      {xc.affectedSituations.length > 0
                        ? `${xc.affectedSituations.length} ситуаций`
                        : 'мета-компонент'}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted mb-2">{xc.purpose}</p>
                  {situations.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {situations.map((s) => (
                        <Link
                          key={s.id}
                          to={`/situation/${s.id}`}
                          className="inline-flex items-center text-xs font-semibold text-navy hover:underline"
                        >
                          {s.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        </Card>
      </div>

      <ConfirmDialog
        open={confirmBlock}
        title="Заблокировать УИ?"
        description="После блокировки вы не сможете получать услуги и входить в кабинет до разблокировки в отделении. Продолжить?"
        confirmLabel="Заблокировать"
        isDanger
        onConfirm={() => {
          setConfirmBlock(false)
        }}
        onCancel={() => setConfirmBlock(false)}
      />
    </div>
  )
}