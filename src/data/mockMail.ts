import type { MailMessage } from '../types/service'

const daysAgo = (n: number) => {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString()
}

export const mockMail: MailMessage[] = [
  {
    id: 'm-1',
    direction: 'in',
    subject: 'Справка о доходах — готова',
    summary:
      'Документ сформирован и подписан. Скачайте его в разделе «Документы» или приложите к другому заявлению.',
    agency: 'Министерство по налогам и сборам',
    agencyUnp: '100582346',
    applicationId: 'a1',
    applicationNum: '453346557107272',
    at: daysAgo(2),
    read: false,
    actionRequired: null,
    attachments: [
      {
        id: 'att-1',
        name: 'Spravka_o_dohodah_2025.pdf',
        format: 'pdf',
        sizeKb: 148,
        signed: true,
      },
    ],
    signatureVerified: true,
    signedAt: daysAgo(2),
  },
  {
    id: 'm-2',
    direction: 'in',
    subject: 'Требуется подпись по заявлению 289953663290680',
    summary:
      'Заявление сформировано. Для отправки в ведомство подпишите его электронной цифровой подписью.',
    agency: 'Министерство по налогам и сборам',
    agencyUnp: '100582346',
    applicationId: 'a2',
    applicationNum: '289953663290680',
    at: daysAgo(2),
    read: false,
    actionRequired: 'sign',
    attachments: [
      {
        id: 'att-2',
        name: 'Zayavlenie_289953663290680.pdf',
        format: 'pdf',
        sizeKb: 92,
        signed: false,
      },
    ],
    signatureVerified: true,
    signedAt: daysAgo(2),
  },
  {
    id: 'm-3',
    direction: 'in',
    subject: 'Официальное уведомление о плановых работах',
    summary:
      'В ночь с 31 октября на 1 ноября портал может быть недоступен с 00:00 до 02:00. Заявления и черновики сохранятся.',
    agency: 'Национальный центр электронных услуг',
    agencyUnp: '191700161',
    at: daysAgo(1),
    read: true,
    actionRequired: null,
    attachments: [
      {
        id: 'att-3',
        name: 'Uvedomlenie_o_rabotah.pdf',
        format: 'pdf',
        sizeKb: 54,
        signed: true,
      },
    ],
    signatureVerified: true,
    signedAt: daysAgo(1),
  },
  {
    id: 'm-4',
    direction: 'out',
    subject: 'Заявление о предоставлении справки о доходах',
    summary:
      'Заявление подано в Министерство по налогам и сборам. Ожидайте официального ответа.',
    agency: 'Министерство по налогам и сборам',
    agencyUnp: '100582346',
    applicationId: 'a1',
    applicationNum: '453346557107272',
    at: daysAgo(3),
    read: true,
    actionRequired: null,
    attachments: [
      {
        id: 'att-4',
        name: 'Zayavlenie_453346557107272.pdf',
        format: 'pdf',
        sizeKb: 120,
        signed: true,
      },
    ],
    signatureVerified: true,
    signedAt: daysAgo(3),
  },
  {
    id: 'm-5',
    direction: 'in',
    subject: 'Паспорт — принято к рассмотрению',
    summary:
      'Заявление № 100294837561002 принято. Срок рассмотрения — 15 рабочих дней. О результате придёт отдельное уведомление.',
    agency: 'Министерство внутренних дел',
    agencyUnp: '100005078',
    applicationId: 'a3',
    applicationNum: '100294837561002',
    at: daysAgo(1),
    read: true,
    actionRequired: null,
    attachments: [],
    signatureVerified: true,
    signedAt: daysAgo(1),
  },
]