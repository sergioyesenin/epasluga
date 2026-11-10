import type { Document } from '../types/service'

const daysAgo = (n: number) => {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString()
}

export const mockDocuments: Document[] = [
  {
    id: 'doc-1',
    title: 'Справка о доходах за 2025 год',
    applicationId: 'a1',
    applicationNum: '453346557107272',
    issuer: 'Министерство по налогам и сборам',
    format: 'pdf',
    sizeKb: 148,
    issuedAt: daysAgo(2),
    validUntil: daysAgo(-28), // действует 30 дней
    qrPayload: 'https://epasluga.by/verify?doc=453346557107272',
  },
  {
    id: 'doc-2',
    title: 'Справка о состоянии на учёте нуждающихся',
    issuer: 'Государственный комитет по имуществу',
    format: 'pdf',
    sizeKb: 92,
    issuedAt: daysAgo(14),
    qrPayload: 'https://epasluga.by/verify?doc=DOC-2-2026',
  },
  {
    id: 'doc-3',
    title: 'Выписка из лицевого счёта ФСЗН',
    applicationId: 'a2',
    applicationNum: '289953663290680',
    issuer: 'Фонд социальной защиты населения',
    format: 'pdf',
    sizeKb: 210,
    issuedAt: daysAgo(30),
    qrPayload: 'https://epasluga.by/verify?doc=289953663290680',
  },
]