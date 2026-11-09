export type AuthLevel = 'none' | 'id' | 'ecp'

export interface Service {
  id: string
  code: string              // «3.05.03» — вторично, мелким шрифтом
  shortTitle: string        // «Справка о доходах» — главное
  officialTitle: string     // «Сведения о доходах физического лица...»
  plainDescription: string  // 1–2 предложения по-человечески
  official: string          // полное юридическое — в аккордеон
  category: string          // id категории (ip/law/edu/...)
  categoryTitle: string     // «Налоги и торговля» — для отображения
  situations: string[]      // ['tax', 'work', 'housing']
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
  id: string;
  name: string;
  shortName: string;
  // Можно добавить logo или ссылку на сайт
}

export type SituationStep = {
  id: string;
  order: number;
  title: string; // «Подать заявление на регистрацию»
  description?: string; // «Понадобится паспорт и документ на авто»
  serviceId?: string; // Ссылка на ID услуги из вашего data/services.ts (если шаг онлайн)
  externalAction?: string; // Если процедура офлайн (например, «Получить медсправку»)
  agencyId: string; // Кто оказывает
  estimatedTime?: string;
  isOptional?: boolean;
};

export interface LifeSituation {
  id: string;
  title: string; // «Покупка автомобиля»
  painPoint: string; // «Вы купили машину и не знаете, с чего начать»
  outcome: string; // «Авто зарегистрировано, страховка оформлена»
  categoryIds: string[]; // ['transport', 'tax']
  steps: SituationStep[];
  faq?: { question: string; answer: string }[];
}

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
  /** id шага в этой ситуации (чтобы подсветить конкретный шаг). */
  situationStepId?: string
}