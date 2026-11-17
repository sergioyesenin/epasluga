import { useCallback, useEffect, useState } from 'react'
import type { Application } from '../types/service'
import { isRecord, readJson, writeJson } from './storage'

const APPS_KEY = 'epasluga-apps'
/** Событие для обновления в этой же вкладке, когда заявление меняют вне хука. */
const CHANGE_EVENT = 'epasluga-apps-change'

const daysAgo = (n: number) => new Date(Date.now() - n * 86400000).toISOString()

// Демо-заявления. Были случайно вырезаны в коммите 4fa83dd — восстановлены из истории.
const SEED: Application[] = [
  {
    id: 'a1',
    num: '453346557107272',
    title: 'Справка о доходах',
    serviceId: '3-05-03',
    initiator: 'Министерство по налогам и сборам',
    status: 'Выполнено',
    at: new Date().toISOString(),
    comment: '',
  },
  {
    id: 'a2',
    num: '289953663290680',
    title: 'Справка о доходах',
    serviceId: '3-05-03',
    initiator: 'Министерство по налогам и сборам',
    status: 'Ожидает оплаты',
    at: new Date().toISOString(),
    comment: '',
  },
  {
    id: 'a3',
    num: '100294837561002',
    title: 'Паспорт гражданина РБ',
    serviceId: '200-12-1',
    initiator: 'Министерство внутренних дел',
    status: 'На проверке',
    at: daysAgo(1),
    comment: '',
  },
  {
    id: 'a4',
    num: '100294837561088',
    title: 'Регистрация автомобиля',
    serviceId: '200-15-11',
    initiator: 'Министерство внутренних дел',
    status: 'Черновик',
    at: daysAgo(2),
    comment: '',
  },
  {
    id: 'a5',
    num: '100294837561201',
    title: 'Справка призывнику',
    serviceId: '200-20-5',
    initiator: 'Министерство обороны',
    status: 'Отозвано',
    at: daysAgo(4),
    comment: '',
  },
  {
    id: 'a6',
    num: '100294837561333',
    title: 'Лицензия адвоката',
    serviceId: '200-17-1-1',
    initiator: 'Министерство юстиции',
    status: 'Отказано',
    at: daysAgo(8),
    comment: 'Неполный комплект документов',
  },
]

/** Минимальная проверка формы: без этих полей экраны «Моих услуг» упадут. */
function isApplicationList(value: unknown): value is Application[] {
  return (
    Array.isArray(value) &&
    value.every(
      (a) =>
        isRecord(a) &&
        typeof a.id === 'string' &&
        typeof a.title === 'string' &&
        typeof a.serviceId === 'string' &&
        typeof a.status === 'string' &&
        typeof a.at === 'string',
    )
  )
}

function read(): Application[] {
  const rows = readJson<Application[] | null>(APPS_KEY, null, isApplicationList)
  // Пустой массив мог остаться от версии без демо-данных — засеваем заново.
  // Повреждённые данные или чужой формат — тоже
  if (rows && rows.length > 0) {
    return rows
  }
  writeJson(APPS_KEY, SEED)
  return SEED
}

function write(rows: Application[]) {
  writeJson(APPS_KEY, rows)
}

/** Запись вне хука (из «Далони»): все экземпляры useApplications перечитают данные. */
function writeAndNotify(rows: Application[]) {
  write(rows)
  window.dispatchEvent(new Event(CHANGE_EVENT))
}

/** Номер и id нового заявления. В продукте номер присваивает сервер при регистрации. */
export function newApplicationIds(): { id: string; num: string } {
  const stamp = Date.now()
  return { id: `a${stamp}`, num: String(stamp).slice(-12) }
}

/** Добавить заявление из любого места — например, регистрацию на РТ из «Далони». */
export function addApplication(app: Application) {
  writeAndNotify([app, ...read()])
}

export function patchApplication(id: string, patch: Partial<Application>) {
  writeAndNotify(read().map((a) => (a.id === id ? { ...a, ...patch } : a)))
}

/** Убрать заявления, созданные демо «Далони», — при сбросе демо. */
export function removeApplications(match: (app: Application) => boolean) {
  writeAndNotify(read().filter((a) => !match(a)))
}

export function useApplications() {
  const [apps, setApps] = useState<Application[]>(() => read())

  useEffect(() => {
    const reload = () => {
      setApps(read())
    }
    const onStorage = (e: StorageEvent) => {
      if (e.key === APPS_KEY) {
        reload()
      }
    }
    window.addEventListener('storage', onStorage)
    window.addEventListener(CHANGE_EVENT, reload)
    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener(CHANGE_EVENT, reload)
    }
  }, [])

  const update = useCallback((id: string, patch: Partial<Application>) => {
    setApps((prev) => {
      const next = prev.map((a) => (a.id === id ? { ...a, ...patch } : a))
      write(next)
      return next
    })
  }, [])

  const remove = useCallback((id: string) => {
    setApps((prev) => {
      const next = prev.filter((a) => a.id !== id)
      write(next)
      return next
    })
  }, [])

  /** Создать новую заявку (используется формой подачи). */
  const add = useCallback((app: Application) => {
    setApps((prev) => {
      const next = [app, ...prev]
      write(next)
      return next
    })
  }, [])

  return { apps, update, remove, add }
}
