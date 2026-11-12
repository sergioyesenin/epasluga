import { useCallback, useEffect, useRef, useState } from 'react'
import type { PayMethod, PaymentRecord } from '../types/dalon'
import { payCharges } from '../lib/dalon/actions'

export type PayStage = 'confirm' | 'processing' | 'ok' | 'fail'

const BANK_DELAY_MS = 1400

/**
 * Демо-оплата: подтверждение → «ждём банк» → успех или сбой.
 * Сбой одноразовый: «Повторить» уже проходит, как в жизни после таймаута банка.
 */
export function usePayment(ids: string[]) {
  const [stage, setStage] = useState<PayStage>('confirm')
  const [method, setMethod] = useState<PayMethod>('erip')
  const [simulateFail, setSimulateFail] = useState(false)
  const [result, setResult] = useState<PaymentRecord[]>([])
  const timer = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (timer.current) {
        window.clearTimeout(timer.current)
      }
    }
  }, [])

  const pay = useCallback(() => {
    setStage('processing')
    timer.current = window.setTimeout(() => {
      if (simulateFail) {
        setSimulateFail(false)
        setStage('fail')
        return
      }
      setResult(payCharges(ids, method))
      setStage('ok')
    }, BANK_DELAY_MS)
  }, [ids, method, simulateFail])

  const changeMethod = useCallback(() => {
    setMethod((m) => (m === 'erip' ? 'card' : 'erip'))
    setStage('confirm')
  }, [])

  return {
    stage,
    method,
    setMethod,
    simulateFail,
    setSimulateFail,
    result,
    pay,
    changeMethod,
  }
}
