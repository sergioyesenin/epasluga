import type { LifeSituation } from '../types/service'

export const lifeSituations: LifeSituation[] = [
  {
    id: 'birth',
    title: 'Рождение ребёнка',
    painPoint: 'Вы стали родителями и не знаете, какие документы оформить в первую очередь.',
    outcome: 'Свидетельство о рождении получено, ребёнок прописан, пособия назначены.',
    categoryIds: ['family', 'social', 'docs'],
    steps: [
      {
        id: 'birth-1',
        order: 1,
        title: 'Зарегистрировать рождение в ЗАГС',
        description: 'Получите свидетельство о рождении. Это можно сделать в роддоме или онлайн.',
        serviceId: '200-5-1', // Регистрация рождения
        agencyId: 'justice',
        estimatedTime: '1 день',
      },
      {
        id: 'birth-2',
        order: 2,
        title: 'Прописать ребёнка',
        description: 'Зарегистрируйте ребёнка по месту жительства родителей.',
        serviceId: '200-13-1', // Регистрация по месту жительства
        agencyId: 'mvd',
        estimatedTime: '1–3 дня',
      },
      {
        id: 'birth-3',
        order: 3,
        title: 'Оформить пособие при рождении',
        description: 'Единовременная выплата от государства.',
        serviceId: '200-2-6', // Пособие в связи с рождением ребенка
        agencyId: 'mintrud',
        estimatedTime: 'до 10 дней',
      },
      {
        id: 'birth-4',
        order: 4,
        title: 'Оформить пособие по уходу до 3 лет',
        description: 'Ежемесячная выплата на ребёнка.',
        serviceId: '200-2-9', // Пособие по уходу за ребенком в возрасте до 3 лет
        agencyId: 'mintrud',
        estimatedTime: 'до 10 дней',
      },
      {
        id: 'birth-5',
        order: 5,
        title: 'Поставить в очередь в детский сад',
        description: 'Можно сделать сразу после получения свидетельства о рождении.',
        serviceId: '200-6-6', // Постановка на учет детей в целях получения дошкольного образования
        agencyId: 'minedu',
        estimatedTime: '15 минут',
        isOptional: true,
      },
    ],
    faq: [
      {
        question: 'Что делать, если мы не состоим в браке?',
        answer:
          'Потребуется совместное заявление в ЗАГС или установление отцовства через суд, если отец не согласен.',
      },
    ],
  },
  {
    id: 'buy-car',
    title: 'Покупка автомобиля',
    painPoint: 'Купили машину, но не знаете, как её правильно оформить и проверить.',
    outcome: 'Автомобиль проверен, зарегистрирован на вас, страховка есть.',
    categoryIds: ['transport', 'law'],
    steps: [
      {
        id: 'car-1',
        order: 1,
        title: 'Проверить автомобиль по VIN',
        description: 'Убедитесь, что машина не в розыске и не в залоге.',
        serviceId: '3-59-01', // Проверка нахождения ТС в розыске по VIN
        agencyId: 'mvd',
        estimatedTime: '5 минут',
      },
      {
        id: 'car-2',
        order: 2,
        title: 'Проверить наличие страховки (ОСАГО)',
        description: 'Убедитесь, что у продавца есть действующий полис.',
        serviceId: '3-53-01', // Запрос на проверку договора ОСАГО
        agencyId: 'mvd',
        estimatedTime: '5 минут',
      },
      {
        id: 'car-3',
        order: 3,
        title: 'Заключить договор купли-продажи',
        description: 'Оформите договор в 3 экземплярах (один для ГАИ).',
        externalAction: 'Оформить договор вручную или через нотариуса',
        agencyId: 'justice',
        estimatedTime: '30 минут',
      },
      {
        id: 'car-4',
        order: 4,
        title: 'Зарегистрировать авто в ГАИ',
        description: 'Поставьте машину на учёт на ваше имя.',
        serviceId: '200-15-11', // Государственная регистрация ТС
        agencyId: 'mvd',
        estimatedTime: '1 день',
      },
    ],
  },
  {
    id: 'university',
    title: 'Поступление в вуз',
    painPoint: 'Заканчиваете школу и хотите подать документы в университет.',
    outcome: 'Документы поданы, вы зачислены.',
    categoryIds: ['education'],
    steps: [
      {
        id: 'uni-1',
        order: 1,
        title: 'Проверить документы об образовании',
        description: 'Убедитесь, что ваш аттестат или диплом в порядке.',
        serviceId: '3-101-01', // Получение сведений о документах об образовании
        agencyId: 'minedu',
        estimatedTime: '15 минут',
      },
      {
        id: 'uni-2',
        order: 2,
        title: 'Подать документы в приёмную комиссию',
        description: 'В большинстве вузов это делается через личный кабинет абитуриента.',
        externalAction: 'Подать документы на сайте вуза',
        agencyId: 'minedu',
        estimatedTime: '1 день',
      },
    ],
  },
  {
    id: 'kindergarten',
    title: 'Устройство в детский сад',
    painPoint: 'Ребёнку пора в садик, но очередь и оформление кажутся сложными.',
    outcome: 'Ребёнок в очереди, место получено, документы оформлены.',
    categoryIds: ['family', 'education'],
    steps: [
      {
        id: 'kg-1',
        order: 1,
        title: 'Поставить ребёнка в очередь',
        description: 'Подайте заявление на постановку в очередь в детский сад онлайн.',
        serviceId: '200-6-6', // Постановка на учет детей
        agencyId: 'minedu',
        estimatedTime: '15 минут',
      },
      {
        id: 'kg-2',
        order: 2,
        title: 'Проверить статус в очереди',
        description: 'Узнайте, на каком месте вы находитесь.',
        serviceId: '3-08-02', // Сведения о состоянии в очереди
        agencyId: 'minedu',
        estimatedTime: '5 минут',
        isOptional: true,
      },
      {
        id: 'kg-3',
        order: 3,
        title: 'Получить направление в садик',
        description: 'Когда подойдёт очередь, вы получите направление.',
        serviceId: '200-6-7', // Выдача направления в учреждение образования
        agencyId: 'minedu',
        estimatedTime: '5 дней',
      },
      {
        id: 'kg-4',
        order: 4,
        title: 'Пройти медосмотр',
        description: 'Для оформления в садик потребуется медицинская справка.',
        externalAction: 'Обратиться в поликлинику по месту жительства',
        agencyId: 'minzdrav',
        estimatedTime: '1-2 дня',
      },
    ],
  },
  {
    id: 'retirement',
    title: 'Выход на пенсию',
    painPoint: 'Приближается пенсионный возраст, и вы хотите заранее подготовить документы.',
    outcome: 'Пенсия назначена, справки получены, льготы оформлены.',
    categoryIds: ['social', 'finance'],
    steps: [
      {
        id: 'retire-1',
        order: 1,
        title: 'Проверить свой стаж и заработок',
        description: 'Закажите выписку из ФСЗН, чтобы убедиться, что все данные верны.',
        serviceId: '3-25-09', // Выписка из ИЛС
        agencyId: 'mintrud',
        estimatedTime: '1 день',
      },
      {
        id: 'retire-2',
        order: 2,
        title: 'Подать заявление на пенсию',
        description: 'Обратитесь в орган по труду и социальной защите.',
        externalAction: 'Подать заявление в службу по труду, занятости и соцзащите',
        agencyId: 'mintrud',
        estimatedTime: '1 день',
      },
      {
        id: 'retire-3',
        order: 3,
        title: 'Получить пенсионное удостоверение',
        description: 'Документ, подтверждающий ваш статус.',
        serviceId: '200-3-14', // Выдача пенсионного удостоверения
        agencyId: 'mintrud',
        estimatedTime: '10 дней',
      },
      {
        id: 'retire-4',
        order: 4,
        title: 'Узнать размер пенсии',
        description: 'Получите актуальную справку о размере вашей пенсии.',
        serviceId: '200-2-26ф', // Справка о размере пенсии
        agencyId: 'mintrud',
        estimatedTime: '1 день',
        isOptional: true,
      },
    ],
  },
  {
    id: 'start-business',
    title: 'Открытие бизнеса (ИП)',
    painPoint: 'Хотите начать своё дело, но не знаете, с чего начать и какие документы нужны.',
    outcome: 'ИП зарегистрировано, счёт открыт, можно работать легально.',
    categoryIds: ['business', 'law'],
    steps: [
      {
        id: 'biz-1',
        order: 1,
        title: 'Зарегистрироваться как ИП',
        description: 'Подайте документы на государственную регистрацию.',
        serviceId: '200-4-2', // Государственная регистрация ИП
        agencyId: 'justice',
        estimatedTime: '1 день',
      },
      {
        id: 'biz-2',
        order: 2,
        title: 'Поставиться на учёт в налоговой',
        description: 'Это происходит автоматически после регистрации, но стоит проверить.',
        serviceId: '3-01-01', // Сведения о юридических лицах и ИП в ЕГР
        agencyId: 'mns',
        estimatedTime: '5 минут',
      },
      {
        id: 'biz-3',
        order: 3,
        title: 'Получить ЭЦП для бизнеса',
        description: 'Электронная подпись нужна для сдачи отчётности.',
        serviceId: '6-0-00', // Дистанционное издание сертификата ИП
        agencyId: 'nces',
        estimatedTime: '1 день',
      },
      {
        id: 'biz-4',
        order: 4,
        title: 'Проверить деловую репутацию',
        description: 'Перед сделками проверяйте своих контрагентов.',
        serviceId: '3-36-01', // Проверка деловой репутации
        agencyId: 'nces',
        estimatedTime: 'Сразу',
        isOptional: true,
      },
    ],
  },
  {
    id: 'real-estate',
    title: 'Покупка/продажа недвижимости',
    painPoint: 'Сделка с квартирой или домом — это стресс и множество юридических тонкостей.',
    outcome: 'Сделка проверена, документы оформлены, право собственности зарегистрировано.',
    categoryIds: ['housing', 'finance'],
    steps: [
      {
        id: 're-1',
        order: 1,
        title: 'Проверить объект недвижимости',
        description: 'Убедитесь в отсутствии обременений и прав третьих лиц.',
        serviceId: '3-02-01', // Информация о правах и ограничениях на земельный участок
        agencyId: 'goskomim',
        estimatedTime: '5 минут',
      },
      {
        id: 're-2',
        order: 2,
        title: 'Получить справку о стоимости',
        description: 'Для расчёта налогов при продаже может потребоваться справка.',
        serviceId: '3-02-05', // Сведения о кадастровой стоимости участка
        agencyId: 'goskomim',
        estimatedTime: 'Сразу',
        isOptional: true,
      },
      {
        id: 're-3',
        order: 3,
        title: 'Зарегистрировать сделку',
        description: 'Государственная регистрация перехода прав собственности.',
        serviceId: '200-22', // Регистрация недвижимости
        agencyId: 'goskomim',
        estimatedTime: '5-15 дней',
      },
      {
        id: 're-4',
        order: 4,
        title: 'Оформить договор найма (если нужно)',
        description: 'Если вы сдаёте или снимаете жильё, договор нужно зарегистрировать.',
        serviceId: '200-1-8', // Регистрация договора найма
        agencyId: 'goskomim',
        estimatedTime: '1 день',
        isOptional: true,
      },
    ],
  },
  {
    id: 'change-residence',
    title: 'Смена места жительства',
    painPoint: 'Переехали в другой город или квартиру, и нужно обновить все документы.',
    outcome: 'Регистрация обновлена, все инстанции уведомлены.',
    categoryIds: ['social', 'docs'],
    steps: [
      {
        id: 'res-1',
        order: 1,
        title: 'Сняться с регистрационного учёта',
        description: 'Обязательно сделайте это по старому месту жительства.',
        serviceId: '200-13-3', // Снятие с регистрационного учета по месту пребывания
        agencyId: 'mvd',
        estimatedTime: '1 день',
      },
      {
        id: 'res-2',
        order: 2,
        title: 'Зарегистрироваться по новому месту жительства',
        description: 'Подайте заявление на регистрацию по новому адресу.',
        serviceId: '200-13-1', // Регистрация по месту жительства
        agencyId: 'mvd',
        estimatedTime: '1-3 дня',
      },
      {
        id: 'res-3',
        order: 3,
        title: 'Проверить данные в регистре',
        description: 'Убедитесь, что ваши данные обновлены во всех системах.',
        serviceId: '3-09-01', // Основные персональные данные
        agencyId: 'nces',
        estimatedTime: 'Сразу',
        isOptional: true,
      },
    ],
  },
  {
    id: 'loss-of-relative',
    title: 'Утрата близкого',
    painPoint: 'Смерть близкого человека — это не только горе, но и множество юридических формальностей.',
    outcome: 'Все документы оформлены, наследство принято.',
    categoryIds: ['social', 'law'],
    steps: [
      {
        id: 'loss-1',
        order: 1,
        title: 'Зарегистрировать смерть в ЗАГС',
        description: 'Получите свидетельство о смерти.',
        serviceId: '200-5-5', // Регистрация смерти
        agencyId: 'justice',
        estimatedTime: '1 день',
      },
      {
        id: 'loss-2',
        order: 2,
        title: 'Оформить пособие на погребение',
        description: 'Государство компенсирует часть расходов на похороны.',
        serviceId: '200-2-35', // Выплата пособия на погребение
        agencyId: 'mintrud',
        estimatedTime: '1 день',
      },
      {
        id: 'loss-3',
        order: 3,
        title: 'Получить справку о месте захоронения',
        description: 'Если могила находится в другом месте, это поможет её найти.',
        serviceId: '200-2-37', // Справка о месте захоронения
        agencyId: 'nces',
        estimatedTime: '5 дней',
        isOptional: true,
      },
      {
        id: 'loss-4',
        order: 4,
        title: 'Подать заявление на наследство',
        description: 'Обратитесь к нотариусу в течение 6 месяцев.',
        externalAction: 'Обратиться к нотариусу по месту открытия наследства',
        agencyId: 'justice',
        estimatedTime: '1 день',
      },
    ],
  },
  {
    id: 'lost-documents',
    title: 'Потеря документов',
    painPoint: 'Утеря паспорта или других важных документов — это серьёзная проблема.',
    outcome: 'Документы восстановлены, все системы уведомлены.',
    categoryIds: ['docs', 'law'],
    steps: [
      {
        id: 'lost-1',
        order: 1,
        title: 'Подать заявление в милицию',
        description: 'Это необходимо для восстановления документов.',
        externalAction: 'Обратиться в ближайший отдел милиции',
        agencyId: 'mvd',
        estimatedTime: '30 минут',
      },
      {
        id: 'lost-2',
        order: 2,
        title: 'Восстановить паспорт',
        description: 'Подайте заявление на выдачу нового паспорта.',
        serviceId: '200-12-1', // Выдача, обмен паспорта
        agencyId: 'mvd',
        estimatedTime: '15 дней',
      },
      {
        id: 'lost-3',
        order: 3,
        title: 'Проверить статус документа',
        description: 'Убедитесь, что старый паспорт недействителен.',
        serviceId: '3-75-01', // Проверка действительности документов
        agencyId: 'mvd',
        estimatedTime: 'Сразу',
        isOptional: true,
      },
    ],
  },
]