import { useCallback, useState } from 'react'
import {
  getNotifyPermission,
  requestNotifyPermission,
  type NotifyPermission,
} from '../lib/pwa/localNotifications'

/** Разрешение на уведомления + запрос по кнопке. */
export function useNotifyPermission() {
  const [permission, setPermission] = useState<NotifyPermission>(getNotifyPermission)

  const request = useCallback(async () => {
    const next = await requestNotifyPermission()
    setPermission(next)
    return next
  }, [])

  return { permission, request }
}
