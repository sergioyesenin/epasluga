import { useCallback, useEffect, useState } from 'react'
import {
  enrollBiometric,
  getEnrollment,
  isBiometricAvailable,
  removeBiometric,
  type BiometricEnrollment,
} from '../lib/biometric'

/**
 * Состояние биометрического входа на этом устройстве.
 * available: null — ещё проверяем, false — сканера нет или страница не по HTTPS.
 */
export function useBiometric() {
  const [available, setAvailable] = useState<boolean | null>(null)
  const [enrollment, setEnrollment] = useState<BiometricEnrollment | null>(getEnrollment)

  useEffect(() => {
    let alive = true
    void isBiometricAvailable().then((ok) => {
      if (alive) {
        setAvailable(ok)
      }
    })
    return () => {
      alive = false
    }
  }, [])

  const enable = useCallback(() => {
    setEnrollment(enrollBiometric())
  }, [])

  const disable = useCallback(() => {
    removeBiometric()
    setEnrollment(null)
  }, [])

  return { available, enrolled: enrollment !== null, enrollment, enable, disable }
}
