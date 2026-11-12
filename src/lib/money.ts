/** Деньги храним в копейках (целые числа), показываем в рублях. */

const NBSP = String.fromCharCode(160)

/** 18640 → «186,40». */
export function formatMoney(kopecks: number): string {
  return (kopecks / 100).toLocaleString('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

/** 18640 → «186,40 BYN» (неразрывный пробел перед валютой). */
export function formatBYN(kopecks: number): string {
  return `${formatMoney(kopecks)}${NBSP}BYN`
}
