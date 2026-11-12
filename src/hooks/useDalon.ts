import { useMemo, useSyncExternalStore } from 'react'
import { getDalonState, subscribeDalon } from '../lib/dalon/store'
import {
  byKeyDate,
  pendingConsents,
  sumDue,
  timeline,
  visibleCharges,
} from '../lib/dalon/selectors'

/** Состояние «Далони» из localStorage, общее для всех экранов. */
export function useDalonState() {
  return useSyncExternalStore(subscribeDalon, getDalonState, getDalonState)
}

/** Состояние + то, что из него считается: видимые начисления, итог, сроки. */
export function useDalon() {
  const state = useDalonState()

  return useMemo(() => {
    const now = new Date()
    const charges = visibleCharges(state).sort(byKeyDate(now))
    return {
      state,
      now,
      charges,
      total: sumDue(charges, now),
      timeline: timeline(state, now),
      pending: pendingConsents(state),
    }
  }, [state])
}
