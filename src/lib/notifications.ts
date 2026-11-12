import { useCallback, useEffect, useState } from 'react'
import type { AppNotification, NotificationKind } from '../types/service'

const NOTIF_KEY = 'epasluga-notifs'
/** Событие для обновления в этой же вкладке (storage приходит только из других). */
const CHANGE_EVENT = 'epasluga-notifs-change'

const daysAgo = (n: number) => new Date(Date.now() - n * 86400000).toISOString()

const SEED: AppNotification[] = [
  {
    id: 'n1',
    kind: 'legal',
    title: 'Справка о доходах — Готово',
    body: 'Документ можно скачать в разделе «Мои услуги».',
    at: daysAgo(0),
    archived: false,
  },
  {
    id: 'n2',
    kind: 'legal',
    title: 'Справка о доходах — Ожидает оплаты',
    body: 'Заявление 289953663290680 не будет выдано, пока не поступит оплата.',
    at: daysAgo(0),
    archived: false,
  },
  {
    id: 'n3',
    kind: 'legal',
    title: 'Справка призывнику — Отозвано',
    body: 'Вы отменили заявление. Документ не действует.',
    at: daysAgo(4),
    archived: false,
  },
  {
    id: 'n4',
    kind: 'legal',
    title: 'Лицензия адвоката — Отказано',
    body: 'Ведомство не смогло оказать услугу. Причина указана в «Моих услугах».',
    at: daysAgo(8),
    archived: false,
  },
  {
    id: 'n5',
    kind: 'info',
    title: 'Плановые работы 1 ноября',
    body: 'Ночью кабинет может быть недоступен около двух часов.',
    at: daysAgo(1),
    archived: false,
  },
  {
    id: 'n6',
    kind: 'info',
    title: 'Черновик заявления не отправлен',
    body: 'Регистрация авто сохранена как черновик.',
    at: daysAgo(2),
    archived: false,
  },
]

function read(): AppNotification[] {
  try {
    const raw = JSON.parse(localStorage.getItem(NOTIF_KEY) || 'null')
    if (Array.isArray(raw)) {
      return raw
    }
  } catch {
    // повреждённые данные — засеваем заново
  }
  localStorage.setItem(NOTIF_KEY, JSON.stringify(SEED))
  return SEED
}

function write(rows: AppNotification[]) {
  localStorage.setItem(NOTIF_KEY, JSON.stringify(rows))
  window.dispatchEvent(new Event(CHANGE_EVENT))
}

/** Добавить уведомление из любого места (например, после оплаты в «Далони»). */
export function addNotification(kind: NotificationKind, title: string, body: string) {
  const row: AppNotification = {
    id: `n-${Date.now()}`,
    kind,
    title,
    body,
    at: new Date().toISOString(),
    archived: false,
  }
  write([row, ...read()])
}

export function useNotifications() {
  const [items, setItems] = useState<AppNotification[]>(() => read())

  useEffect(() => {
    const reload = () => {
      setItems(read())
    }
    const onStorage = (e: StorageEvent) => {
      if (e.key === NOTIF_KEY) {
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

  // Пишем в хранилище, а событие CHANGE_EVENT обновит все экземпляры хука
  const archive = useCallback((id: string) => {
    write(read().map((n) => (n.id === id ? { ...n, archived: true } : n)))
  }, [])

  const unarchive = useCallback((id: string) => {
    write(read().map((n) => (n.id === id ? { ...n, archived: false } : n)))
  }, [])

  const remove = useCallback((id: string) => {
    // Юридически значимые уведомления удалить нельзя — только в архив
    write(read().filter((n) => n.id !== id || n.kind === 'legal'))
  }, [])

  return { items, archive, unarchive, remove }
}
