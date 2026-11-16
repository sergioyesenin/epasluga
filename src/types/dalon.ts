/* --- Семейный раздел «Далонь» --- */

/** Человек в семье. Состав семьи — только по записям ЗАГС. */
export type PersonKind = 'adult' | 'child'

/** Имущество семьи: на панели — листья на стебле. */
export type AssetKind = 'car' | 'flat' | 'dacha'

export type MemberKind = PersonKind | AssetKind

/** Вид записи акта гражданского состояния. */
export type ZagsKind = 'marriage' | 'birth' | 'divorce' | 'death'

export interface ZagsRecord {
  kind: ZagsKind
  /** Номер записи акта. */
  number: string
  /** Дата регистрации (ISO). */
  date: string
  /** Кто зарегистрировал: отдел ЗАГС. */
  office: string
}

export interface DalonPerson {
  id: string
  /** Короткое имя для растения и фильтров. */
  name: string
  /** ФИО. */
  full: string
  /** Кем приходится: «Вы», «Супруга», «Дочь». */
  relation: string
  kind: PersonKind
  initials: string
  /** Дата рождения (ISO). */
  birth: string
  /** На какой записи ЗАГС держится связь. У владельца кабинета её нет. */
  basis?: ZagsRecord
  /** Запись ЗАГС, которая закрыла связь: расторжение брака или смерть. */
  closedBy?: ZagsRecord
  /** «Платит» за семью: взрослые включают и выключают сами. */
  pays: boolean
  /** Школа и класс — для школьников. */
  school?: { name: string; grade: number }
  /** Детский сад — для малышей. */
  kindergarten?: string
}

export interface DalonAsset {
  id: string
  kind: AssetKind
  /** Короткое имя для листа: «Polo», «Квартира». */
  name: string
  full: string
  /** Номер, адрес, площадь. */
  detail: string
  /** Кому принадлежит: «владелец — вы». */
  owners: string
  /** Откуда известно об имуществе. */
  source: string
}

/**
 * К кому относятся начисления: человек или имущество.
 * Общий вид для списков, аватаров и квитанций.
 */
export interface DalonMember {
  id: string
  name: string
  full: string
  /** «Супруга», «Дочь, 14 лет, 9 класс», «7714 AB-7, владелец — вы». */
  role: string
  kind: MemberKind
  initials: string
}

/** Тип начисления — от него зависит цвет метки. */
export type ChargeType = 'tax' | 'fine' | 'car' | 'kids' | 'home' | 'telecom' | 'edu'

export interface DalonCharge {
  id: string
  /** id человека или имущества. */
  memberId: string
  type: ChargeType
  title: string
  /** Уточнение: адрес, учреждение, период. */
  detail: string
  /** Получатель платежа. */
  payee: string
  /** Сумма в копейках (целые числа — без ошибок округления). */
  amount: number
  /** Срок оплаты (ISO). */
  dueAt: string
  /** Скидка за раннюю оплату (штрафы ГАИ — 50 %). */
  discount?: {
    percent: number
    until: string
  }
  /** Заявление в «Моих услугах», которое ждёт этой оплаты (регистрация на РТ). */
  appId?: string
}

/** Срок, который не платёж: техосмотр, замена паспорта, день тестирования. */
export interface DalonDeadline {
  id: string
  memberId: string
  type: 'car' | 'doc' | 'edu'
  title: string
  detail: string
  dueAt: string
  /** Куда ведёт кнопка (маршрут внутри приложения). */
  href: string
  action: string
}

export type PayMethod = 'erip' | 'card'

export interface PaymentRecord {
  id: string
  title: string
  memberId: string
  type: ChargeType
  payee: string
  amount: number
  paidAt: string
  method: PayMethod
  /** Номер квитанции. */
  receipt: string
  appId?: string
}

export interface RemindSettings {
  d7: boolean
  d1: boolean
  d0: boolean
  push: boolean
  sms: boolean
  email: boolean
  tax: boolean
  fine: boolean
  kids: boolean
  home: boolean
  doc: boolean
}

export type RemindKey = keyof RemindSettings

/** Кто сделал запись в журнале: вы, другой взрослый семьи, реестр ЗАГС или система. */
export type LogSource = 'you' | 'family' | 'zags' | 'system'

export interface DalonLogEntry {
  id: string
  at: string
  text: string
  source?: LogSource
}

/* --- Профориентация --- */

export type CareerProfileId = 'tech' | 'science' | 'people' | 'business' | 'creative' | 'society'

export interface CareerResult {
  memberId: string
  at: string
  /** Сколько ответов набрал каждый профиль. */
  scores: Record<CareerProfileId, number>
  top: CareerProfileId
}

/* --- Тестирование РИКЗ: РТ / ЦТ / ЦЭ --- */

export type TestingKind = 'rt' | 'ct' | 'ce'

export type TestingStatus = 'awaiting-payment' | 'registered' | 'submitted'

export interface TestingRegistration {
  id: string
  memberId: string
  kind: TestingKind
  subjects: string[]
  /** Дата тестирования (ISO). */
  date: string
  /** Этап или сессия: «Этап 1». */
  session: string
  city: string
  point: string
  status: TestingStatus
  /** Заявление в «Моих услугах». */
  appId: string
  /** Начисление за РТ, пока не оплачено. */
  chargeId?: string
  /** Номер пропуска — после оплаты или подтверждения. */
  pass?: string
  /** Сумма в копейках (для РТ). */
  amount: number
}

export interface DalonState {
  v: number
  people: DalonPerson[]
  assets: DalonAsset[]
  charges: DalonCharge[]
  deadlines: DalonDeadline[]
  history: PaymentRecord[]
  remind: RemindSettings
  /** Журнал действий: события ЗАГС, оплаты, права. */
  log: DalonLogEntry[]
  /** Результаты теста на профориентацию. */
  career: CareerResult[]
  /** Регистрации на РТ / ЦТ / ЦЭ. */
  testing: TestingRegistration[]
  /** Предложения системы, которые скрыли кнопкой «Не сейчас». */
  dismissed: string[]
}
