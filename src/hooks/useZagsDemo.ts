import { useCallback, useState } from 'react'
import { NEWBORN_SEED } from '../data/dalon'
import { activePeople, activeSpouse } from '../lib/dalon/selectors'
import { deathCandidates, hasNewborn, receiveBirth, receiveDeath, receiveDivorce } from '../lib/dalon/zags'
import { resetDalonDemo } from '../lib/dalon/demo'
import { FLOWER_MIN_PEOPLE } from '../lib/dalon/plant'
import { countText } from '../lib/dates'
import { showToast } from '../lib/toast'
import { useDalonState } from './useDalon'

export type ZagsDemoAction = 'divorce' | 'death' | 'birth' | 'reset'

type Dialog = {
  title: string
  description: string
  confirmLabel: string
}

/**
 * Демо-события из реестра ЗАГС: какое событие ждёт подтверждения,
 * кого касается запись о смерти, тексты диалога и выполнение.
 */
export function useZagsDemo() {
  const state = useDalonState()
  const [pending, setPending] = useState<ZagsDemoAction | null>(null)
  const [deathId, setDeathId] = useState('')

  const spouse = activeSpouse(state)
  const candidates = deathCandidates(state)
  const target = candidates.find((p) => p.id === deathId) ?? candidates[0]
  const born = hasNewborn(state)
  const nextSize = activePeople(state).length + 1

  let dialog: Dialog | null = null
  if (pending === 'divorce' && spouse) {
    dialog = {
      title: 'Демо: запись о расторжении брака',
      description: `Из реестра ЗАГС поступит запись о расторжении брака: ${spouse.full}. Связь в «Далони» закроется сама — ${spouse.name} перестанет видеть начисления семьи и платить за неё, её начисления скроются. Дети остаются с обоими законными представителями. История платежей сохранится.`,
      confirmLabel: 'Поступила запись',
    }
  } else if (pending === 'death' && target) {
    dialog = {
      title: 'Демо: запись о смерти',
      description: `Из реестра ЗАГС поступит запись о смерти: ${target.full}. Связь закроется, начисления этого человека скроются, история платежей сохранится. Это учебная демонстрация на этом устройстве.`,
      confirmLabel: 'Поступила запись',
    }
  } else if (pending === 'birth') {
    const flower =
      nextSize >= FLOWER_MIN_PEOPLE ? ' Росток на панели станет цветком: люди — его лепестки.' : ''
    dialog = {
      title: 'Демо: запись о рождении',
      description: `Из реестра ЗАГС поступит запись о рождении: ${NEWBORN_SEED.full}. Она появится в «Далони» сама — в семье станет ${countText(nextSize, 'человек', 'человека', 'человек')}.${flower}`,
      confirmLabel: 'Поступила запись',
    }
  } else if (pending === 'reset') {
    dialog = {
      title: 'Начать демо заново?',
      description:
        'Состав семьи, начисления, история, предложения и созданные «Далонью» заявления вернутся к исходным. Это только учебные данные на этом устройстве.',
      confirmLabel: 'Начать заново',
    }
  }

  const cancel = useCallback(() => {
    setPending(null)
  }, [])

  const confirm = useCallback(() => {
    if (pending === 'divorce') {
      const p = receiveDivorce()
      if (p) {
        showToast({ tone: 'ok', message: `Связь закрыта по записи ЗАГС: ${p.name}` })
      }
    } else if (pending === 'death' && target) {
      const p = receiveDeath(target.id)
      if (p) {
        showToast({ tone: 'ok', message: `Связь закрыта по записи ЗАГС: ${p.name}` })
      }
    } else if (pending === 'birth') {
      const p = receiveBirth()
      if (p) {
        showToast({ tone: 'ok', message: `Запись о рождении поступила: в семье ${p.name}` })
      }
    } else if (pending === 'reset') {
      resetDalonDemo()
      showToast({ tone: 'ok', message: 'Демо-данные «Далони» восстановлены' })
    }
    setPending(null)
  }, [pending, target])

  return {
    ask: setPending,
    cancel,
    confirm,
    dialog,
    spouse,
    candidates,
    target,
    setDeathId,
    born,
  }
}
