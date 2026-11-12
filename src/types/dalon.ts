/* --- Семейный раздел «Далонь» --- */

export type DalonMemberId = 'me' | 'anna' | 'masha' | 'misha' | 'car'

export type MemberKind = 'adult' | 'child' | 'car'

/** Палец ладони, на котором член семьи показан на панели. */
export type Finger = 'thumb' | 'index' | 'middle' | 'ring' | 'pinky'

export interface DalonMember {
  id: DalonMemberId
  /** Короткое имя для ладони и фильтров. */
  name: string
  /** Полное имя (ФИО) или марка авто. */
  full: string
  /** Кем приходится: «Вы», «Супруга», «Дочь, 9 лет», номер авто. */
  role: string
  kind: MemberKind
  initials: string
  finger: Finger
}

/** Тип начисления — от него зависит цвет метки. */
export type ChargeType = 'tax' | 'fine' | 'car' | 'kids' | 'home' | 'telecom'

export interface DalonCharge {
  id: string
  memberId: DalonMemberId
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
}

/** Срок, который не платёж: техосмотр, замена паспорта. */
export interface DalonDeadline {
  id: string
  memberId: DalonMemberId
  type: 'car' | 'doc'
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
  memberId: DalonMemberId
  type: ChargeType
  payee: string
  amount: number
  paidAt: string
  method: PayMethod
  /** Номер квитанции. */
  receipt: string
}

export type ConsentStatus = 'pending' | 'given' | 'revoked'

/** Взрослый в семейном пространстве: доступ — только по его согласию. */
export interface DalonPerson {
  id: string
  name: string
  full: string
  relation: string
  consent: ConsentStatus
  /** Когда изменился статус согласия (ISO). */
  consentAt: string
  /** Роль «видит»: начисления и сроки семьи. */
  sees: boolean
  /** Роль «платит»: может оплачивать за семью. */
  pays: boolean
  /** Если у человека есть свои начисления на ладони. */
  memberId?: DalonMemberId
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

export interface DalonLogEntry {
  id: string
  at: string
  text: string
}

export interface DalonState {
  v: number
  charges: DalonCharge[]
  deadlines: DalonDeadline[]
  history: PaymentRecord[]
  people: DalonPerson[]
  remind: RemindSettings
  /** Журнал действий: кто и когда привязал, отозвал, оплатил. */
  log: DalonLogEntry[]
}
