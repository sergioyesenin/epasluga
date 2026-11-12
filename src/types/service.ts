export type AuthLevel = 'none' | 'id' | 'ecp'

export interface Service {
  id: string
  code: string
  shortTitle: string
  officialTitle: string
  plainDescription: string
  official: string
  category: string
  categoryTitle: string
  situations: string[]
  authLevel: AuthLevel
  timeToComplete: string
  cost: string
  format: string
  orgName: string
  orgUnp: string
  steps: string[]
}

export interface Situation {
  id: string
  title: string
  hint: string
}

export interface Category {
  id: string
  title: string
  desc: string
  icon: string
}

export type ApplicationStatus =
  | 'Черновик'
  | 'На проверке'
  | 'Ожидает оплаты'
  | 'Выполнено'
  | 'Отозвано'
  | 'Отказано'

export interface Application {
  id: string
  num: string
  title: string
  serviceId: string
  initiator: string
  status: ApplicationStatus
  at: string
  comment: string
  /** Если заявление оформлено из шага жизненной ситуации — её id. */
  situationId?: string
  /** id шага в этой ситуации. */
  situationStepId?: string
}

export type NotificationKind = 'legal' | 'info'

export interface AppNotification {
  id: string
  kind: NotificationKind
  title: string
  body: string
  at: string
  archived: boolean
}

export interface Agency {
  id: string
  name: string
  shortName: string
}

export type SituationStep = {
  id: string
  order: number
  title: string
  description?: string
  serviceId?: string
  externalAction?: string
  agencyId: string
  estimatedTime?: string
  isOptional?: boolean
}

export interface LifeSituation {
  id: string
  title: string
  painPoint: string
  outcome: string
  categoryIds: string[]
  steps: SituationStep[]
  faq?: { question: string; answer: string }[]
}

/* --- Новые сущности для «Личного кабинета» --- */

export type DocumentFormat = 'pdf' | 'xml' | 'zip'

export interface Document {
  id: string
  /** Название документа для пользователя. */
  title: string
  /** Связанное заявление, если есть. */
  applicationId?: string
  /** Номер заявления для отображения. */
  applicationNum?: string
  /** Ведомство, выдавшее документ. */
  issuer: string
  /** Формат файла. */
  format: DocumentFormat
  /** Размер в КБ. */
  sizeKb: number
  /** Дата выдачи (ISO). */
  issuedAt: string
  /** Действителен до (ISO), для справок со сроком. */
  validUntil?: string
  /** Содержимое для QR-кода (короткая ссылка/подпись). */
  qrPayload: string
}

/** Направление: от госоргана или от гражданина. */
export type MailDirection = 'in' | 'out'

/** Вложение — официальный документ в электронной форме. */
export interface MailAttachment {
  id: string
  name: string
  format: 'pdf' | 'xml' | 'zip'
  sizeKb: number
  /** Подпись ЭЦП ведомства/гражданина. */
  signed: boolean
}

/**
 * Официальное сообщение в «Почте гражданина».
 * Все сообщения юридически значимы по определению — это не обычная почта.
 * Отличаются только действием: требуется подпись/оплата или чисто информационное.
 */
export interface MailMessage {
  id: string
  direction: MailDirection
  /** Тема — официальная. */
  subject: string
  /** Краткое сопроводительное сообщение от ведомства (1–3 предложения). */
  summary: string
  /** Госорган — отправитель (in) или получатель (out). */
  agency: string
  /** УНП ведомства (для отображения). */
  agencyUnp?: string
  /** Связанное заявление. */
  applicationId?: string
  applicationNum?: string
  at: string
  read: boolean
  /** Требуется действие гражданина (подписать, оплатить, донести). */
  actionRequired?: 'sign' | 'pay' | 'provide' | null
  /** Вложения — официальные документы. */
  attachments: MailAttachment[]
  /**
   * Подлинность подписи. В реальном приложении — проверка по ЭЦП отправителя.
   * В моке — true для входящих (все подписаны ведомством) и false для исходящих
   * без ЭЦП (например, черновик).
   */
  signatureVerified: boolean
  /** ISO — когда подписано (в демо совпадает с at). */
  signedAt?: string
}

export interface RepositoryFile {
  id: string
  name: string
  format: DocumentFormat
  sizeKb: number
  uploadedAt: string
  /** Куда приложен (например, «К заявлению №…»). */
  attachedTo?: string
}
/* --- Семейный раздел «Далонь» --- */

export type FamilyMemberRole = 'me' | 'adult' | 'child' | 'pet'

export type FamilyMemberStatus = 'paid' | 'unpaid' | 'partial'

/** Тинт аватара: переиспользуем существующую палитру. */
export type FamilyTint = 'sand' | 'peach' | 'rose' | 'tint-navy'

export interface FamilyMember {
  id: string
  /** Полное имя для списка и aria-label. */
  name: string
  /** Инициалы для аватара (1–2 символа). */
  initials: string
  role: FamilyMemberRole
  avatarTint: FamilyTint
  /** Сумма к оплате, в копейках (целое, чтобы избежать float). */
  dueAmount: number
  /** Сколько уже оплачено (может быть частичной оплатой). */
  paidAmount: number
  status: FamilyMemberStatus
}

export interface Charge {
  id: string
  /** Чей это платёж. */
  memberId: string
  /** Что за платёж — «ЖКХ», «Садик», «Кружок» и т.п. */
  title: string
  /** Уточнение: адрес, учреждение, период. */
  detail: string
  /** Сумма к оплате, копейки. */
  amount: number
  /** Срок оплаты (ISO). */
  dueAt: string
  /** Если была скидка — старая сумма. */
  originalAmount?: number
  /** Льгота/категория (пенсия, многодетность и т.п.). */
  label?: 'peach' | 'rose' | 'sand'
}

export interface Payment {
  id: string
  /** Получатель — «ЕРИП», «Садик № 15», «МТС»… */
  payee: string
  /** Назначение для читаемого вида. */
  title: string
  amount: number
  paidAt: string
  /** Метод оплаты. */
  method: 'card' | 'erip' | 'balance'
  memberId?: string
}
