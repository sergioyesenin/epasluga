import { useMemo, useSyncExternalStore } from 'react'
import { getDalonState, subscribeDalon } from '../lib/dalon/store'
import { byKeyDate, membersView, sumDue, timeline, visibleCharges } from '../lib/dalon/selectors'

/** Состояние «Далони» из localStorage, общее для всех экранов. */
export function useDalonState() {
  return useSyncExternalStore(subscribeDalon, getDalonState, getDalonState)
}

/** Состояние + то, что из него считается: видимые начисления, итог, сроки, члены семьи. */
export function useDalon() {
  const state = useDalonState()

  return useMemo(() => {
    const now = new Date()
    const charges = visibleCharges(state, now).sort(byKeyDate(now))
    const members = membersView(state, now)
    return {
      state,
      now,
      charges,
      members,
      /** Человек или имущество по id — для подписей в списках. */
      memberById: (id: string) => members.find((m) => m.id === id),
      total: sumDue(charges, now),
      timeline: timeline(state, now),
    }
  }, [state])
}
