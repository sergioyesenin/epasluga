import type { RepositoryFile } from '../types/service'

const daysAgo = (n: number) => {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString()
}

export const mockRepository: RepositoryFile[] = [
  {
    id: 'f-1',
    name: 'Паспорт_Иванов.pdf',
    format: 'pdf',
    sizeKb: 1240,
    uploadedAt: daysAgo(20),
    attachedTo: 'Заявление № 100294837561002',
  },
  {
    id: 'f-2',
    name: 'Справка_о_доходах_2025.pdf',
    format: 'pdf',
    sizeKb: 148,
    uploadedAt: daysAgo(10),
  },
  {
    id: 'f-3',
    name: 'Техпаспорт_авто.pdf',
    format: 'pdf',
    sizeKb: 890,
    uploadedAt: daysAgo(5),
    attachedTo: 'Черновик «Регистрация автомобиля»',
  },
]
