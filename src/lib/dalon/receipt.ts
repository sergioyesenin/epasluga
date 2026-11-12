import type { PaymentRecord } from '../../types/dalon'
import { memberById } from '../../data/dalon'
import { downloadBlob } from '../download'
import { formatMoney } from '../money'
import { METHOD_LABEL } from './actions'

const PAYER = 'Иванов Алексей Сергеевич'

function esc(s: string): string {
  return s.replace(/[&<>"]/g, (ch) => {
    const map: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }
    return map[ch]
  })
}

/** HTML-квитанция: открывается в любом браузере, печатается в PDF. */
function receiptHtml(items: PaymentRecord[]): string {
  const title = items.length > 1 ? 'Квитанции об оплате (демо)' : 'Квитанция об оплате (демо)'
  const rows = items
    .map((h) => {
      const who = memberById(h.memberId)?.full ?? ''
      return `<tr><td>${esc(h.title)}<br><small>${esc(h.payee)}${who ? ` · за: ${esc(who)}` : ''}</small></td><td>${esc(h.receipt)}</td><td class="r">${formatMoney(h.amount)}&nbsp;BYN</td></tr>`
    })
    .join('')
  const total = items.reduce((acc, h) => acc + h.amount, 0)
  const first = items[0]
  return `<!doctype html><html lang="ru"><head><meta charset="utf-8"><title>${title}</title>
<style>body{font-family:Arial,sans-serif;max-width:640px;margin:40px auto;padding:0 16px;color:#1a1d2b}h1{font-size:22px;margin:0 0 4px}table{width:100%;border-collapse:collapse;margin:16px 0}td{padding:10px 6px;border-bottom:1px solid #e2e5f0;vertical-align:top}small{color:#5a6078}.r{text-align:right;white-space:nowrap}.t{font-size:18px;font-weight:bold}.n{color:#5a6078;font-size:13px}</style></head>
<body><h1>${title}</h1>
<p>Плательщик: ${PAYER}<br>Дата: ${new Date(first.paidAt).toLocaleString('ru-RU')}<br>Способ: ${METHOD_LABEL[first.method]}</p>
<table>${rows}</table><p class="t">Итого: ${formatMoney(total)} BYN</p>
<p class="n">Деньги не хранятся в Е-Паслуге: платёж проведён банком через ЕРИП.<br>Демонстрационная квитанция учебного прототипа. Не является платёжным документом.</p></body></html>`
}

export function downloadReceipts(items: PaymentRecord[]) {
  if (items.length === 0) {
    return
  }
  const latin = items[0].receipt.replace('ЕР', 'ER').replace('БК', 'BK')
  const name = items.length > 1 ? 'kvitancii-dalon.html' : `kvitanciya-${latin}.html`
  downloadBlob(new Blob([receiptHtml(items)], { type: 'text/html;charset=utf-8' }), name)
}
