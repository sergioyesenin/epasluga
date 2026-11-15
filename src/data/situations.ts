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

  // ────────────────────────────────────────────────────────────────────────
  // Волна 1 (P1) — ситуации из мастер-реестра.
  // Юридические коды процедур — рабочие гипотезы, требуют верификации.
  // ────────────────────────────────────────────────────────────────────────
  {
    id: 'ls-01-birth-full',
    registryId: 'LS-01',
    title: 'Рождение ребёнка — полный маршрут',
    painPoint:
      'Родился ребёнок: нужно зарегистрировать рождение, получить пособия, поставить в очередь в сад — и не потерять документы.',
    outcome:
      'Свидетельство о рождении, пособия назначены, ребёнок в очереди в детский сад, льготы оформлены.',
    digitalState: 'yellow',
    priority: 'P1',
    gap: 'Регистрация рождения онлайн + авто-связка с пособиями, очередью в сад, льготами',
    xcDeps: ['XC-01', 'XC-03', 'XC-06'],
    categoryIds: ['family', 'social', 'docs'],
    steps: [
      {
        id: 'ls01-1',
        order: 1,
        title: 'Зарегистрировать рождение онлайн',
        description:
          'Медицинское свидетельство о рождении уже в электронном виде — заполните заявление, свидетельство придёт в кабинет.',
        serviceId: 'ls-01-birth-reg',
        agencyId: 'justice',
        estimatedTime: '1 рабочий день',
      },
      {
        id: 'ls01-2',
        order: 2,
        title: 'Оформить пособие при рождении',
        description:
          'Данные о ребёнке подтянутся из регистрации рождения — заявление займёт пару минут.',
        serviceId: 'ls-01-benefit-birth',
        agencyId: 'mintrud',
        estimatedTime: 'до 10 дней',
      },
      {
        id: 'ls01-3',
        order: 3,
        title: 'Поставить ребёнка в очередь в детский сад',
        description:
          'Услуга уже оцифрована. Заявление подаётся сразу после регистрации рождения.',
        serviceId: '200-6-6',
        agencyId: 'minedu',
        estimatedTime: '15 минут',
      },
      {
        id: 'ls01-4',
        order: 4,
        title: 'Оформить пособие по уходу до 3 лет',
        description: 'Ежемесячная выплата на ребёнка — назначается по данным регистра.',
        serviceId: '200-2-9',
        agencyId: 'mintrud',
        estimatedTime: 'до 10 дней',
      },
      {
        id: 'ls01-5',
        order: 5,
        title: 'Прописать ребёнка',
        description:
          'Регистрация по месту жительства родителей. Часто требуется для пособий и садика.',
        serviceId: '200-13-1',
        agencyId: 'mvd',
        estimatedTime: '1–3 дня',
      },
    ],
    faq: [
      {
        question: 'Нужно ли идти в ЗАГС лично?',
        answer:
          'Нет, если рождение зарегистрировано в роддоме и есть электронное медицинское свидетельство. Личное присутствие — только для установления отцовства через суд или при усыновлении.',
      },
    ],
  },
  {
    id: 'ls-13-lost-docs',
    registryId: 'LS-13',
    title: 'Утрата документов (паспорт, ID)',
    painPoint:
      'Паспорт утерян или истёк — непонятно, с чего начать восстановление и как защититься от мошенников.',
    outcome:
      'Старый документ недействителен, ведомства уведомлены, новый паспорт получен.',
    digitalState: 'yellow',
    priority: 'P1',
    gap: 'Проактивное уведомление есть → нужен маршрут восстановления',
    xcDeps: ['XC-03', 'XC-05', 'XC-06'],
    categoryIds: ['docs', 'law'],
    steps: [
      {
        id: 'ls13-1',
        order: 1,
        title: 'Сообщить об утрате онлайн',
        description:
          'Документ сразу помечается недействительным — это блокирует мошенничество с вашими данными.',
        serviceId: 'ls-13-loss-report',
        agencyId: 'mvd',
        estimatedTime: 'Сразу',
      },
      {
        id: 'ls13-2',
        order: 2,
        title: 'Записаться на замену ID/паспорта',
        description:
          'Понадобится личное присутствие для биометрии и фото. Слоты — в отделении МВД.',
        serviceId: '200-12-1',
        agencyId: 'mvd',
        estimatedTime: '15 дней / 7 срочно',
      },
      {
        id: 'ls13-3',
        order: 3,
        title: 'Проверить, что старый документ недействителен',
        description: 'Убедитесь, что система уже помечала утраченный документ.',
        serviceId: '3-75-01',
        agencyId: 'mvd',
        estimatedTime: 'Сразу',
        isOptional: true,
      },
    ],
    faq: [
      {
        question: 'Нужно ли сначала идти в милицию?',
        answer:
          'При краже — да, заявление в милицию обязательно. При утере достаточно онлайн-уведомления через портал.',
      },
    ],
  },
  {
    id: 'ls-19-tuition-deduction',
    registryId: 'LS-19',
    title: 'Налоговый вычет за обучение',
    painPoint:
      'Оплатили обучение — хотите вернуть часть денег, но собирать справки и декларации долго и непонятно.',
    outcome: 'Часть денег за обучение вернулась на счёт.',
    digitalState: 'yellow',
    priority: 'P1',
    gap: 'Вуз не передаёт данные автоматически → сбор документов',
    xcDeps: ['XC-01', 'XC-04', 'XC-06', 'XC-07'],
    categoryIds: ['finance', 'education'],
    steps: [
      {
        id: 'ls19-1',
        order: 1,
        title: 'Проверить данные о расходах на обучение',
        description:
          'Вуз передаёт сведения о платежах в налоговую — в кабинете видно, сколько можно вернуть.',
        serviceId: 'ls-19-tuition-deduction',
        agencyId: 'mns',
        estimatedTime: '30 дней',
      },
      {
        id: 'ls19-2',
        order: 2,
        title: 'Проверить договор с вузом',
        description:
          'Если договор уже в репозитории документов — ничего прикладывать не нужно.',
        externalAction: 'Приложить договор в «Репозиторий документов», если его там нет',
        agencyId: 'mnedu',
        estimatedTime: '5 минут',
        isOptional: true,
      },
      {
        id: 'ls19-3',
        order: 3,
        title: 'Проверить реквизиты возврата',
        description: 'Деньги придут на счёт, указанный в цифровом профиле.',
        serviceId: '3-04-01',
        agencyId: 'mns',
        estimatedTime: 'Сразу',
        isOptional: true,
      },
    ],
  },
  {
    id: 'ls-23-pension-recalc',
    registryId: 'LS-23',
    title: 'Перерасчёт пенсии работающим пенсионером',
    painPoint:
      'Продолжаете работать после назначения пенсии — каждый год можно пересчитать её с учётом нового стажа, но это требует сбора справок.',
    outcome: 'Пенсия пересчитана с учётом дополнительного стажа и зарплаты.',
    digitalState: 'red',
    priority: 'P1',
    gap: 'Сбор справок и личное заявление',
    xcDeps: ['XC-01', 'XC-06'],
    categoryIds: ['social', 'finance'],
    steps: [
      {
        id: 'ls23-1',
        order: 1,
        title: 'Проверить стаж и зарплату',
        description: 'Закажите выписку из ФСЗН — данные уже в системе.',
        serviceId: '3-25-09',
        agencyId: 'mintrud',
        estimatedTime: '1 рабочий день',
      },
      {
        id: 'ls23-2',
        order: 2,
        title: 'Подать заявление на перерасчёт',
        description:
          'Данные о заработной плате работодатель передаёт в ФСЗН автоматически — справки не нужны.',
        serviceId: 'ls-23-pension-recalc',
        agencyId: 'mintrud',
        estimatedTime: '10 рабочих дней',
      },
      {
        id: 'ls23-3',
        order: 3,
        title: 'Узнать новый размер пенсии',
        description: 'Новый размер — в кабинете, без бумажных справок.',
        serviceId: '3-16-03',
        agencyId: 'mintrud',
        estimatedTime: 'Сразу',
        isOptional: true,
      },
    ],
  },
  {
    id: 'bs-07-car-loan',
    registryId: 'BS-07',
    title: 'Залог авто / кредит (проверка техосмотра)',
    painPoint:
      'Банк просит бумажную справку о техосмотре — приходится ехать в ГАИ или «Белтехосмотр».',
    outcome: 'Банк сам получает статус техосмотра — без бумажной справки.',
    digitalState: 'yellow',
    priority: 'P1',
    gap: 'Банк не видит электронное разрешение → бумажная справка',
    xcDeps: ['XC-06', 'XC-07'],
    categoryIds: ['transport', 'business'],
    steps: [
      {
        id: 'bs07-1',
        order: 1,
        title: 'Проверить статус техосмотра онлайн',
        description:
          'Банк получит статус автоматически, но вы можете убедиться, что всё в порядке.',
        serviceId: 'bs-07-tech-inspection-status',
        agencyId: 'mvd',
        estimatedTime: 'Сразу',
      },
      {
        id: 'bs07-2',
        order: 2,
        title: 'Передать согласие банку',
        description:
          'Банк запрашивает данные по VIN / номеру — ваше согласие нужно один раз.',
        externalAction: 'Подтвердить согласие в приложении банка',
        agencyId: 'mvd',
        estimatedTime: '5 минут',
      },
      {
        id: 'bs07-3',
        order: 3,
        title: 'Убедиться, что техосмотр пройден',
        description: 'Если срок подходит к концу — запишитесь на диагностику заранее.',
        externalAction: 'Записаться на техосмотр через «Белтехосмотр»',
        agencyId: 'mvd',
        estimatedTime: 'по записи',
        isOptional: true,
      },
    ],
  },
  {
    id: 'ls-05-marriage',
    registryId: 'LS-05',
    title: 'Брак / развод / отцовство',
    painPoint:
      'Подать заявление в ЗАГС — значит ехать в отделение и стоять в очереди; а после — ещё и получать бумажное свидетельство.',
    outcome:
      'Заявление на брак подано онлайн, дата церемонии выбрана, пошлина оплачена; свидетельство — в кабинете.',
    digitalState: 'yellow',
    priority: 'P2',
    gap: 'Онлайн только подача; церемония и свидетельство — офлайн',
    xcDeps: ['XC-04', 'XC-05'],
    categoryIds: ['family', 'docs'],
    steps: [
      {
        id: 'ls05-1',
        order: 1,
        title: 'Подать заявление на брак онлайн',
        description:
          'Данные о вас подтянутся из регистра населения. Выберите дату и место церемонии.',
        serviceId: 'ls-05-marriage-online',
        agencyId: 'justice',
        estimatedTime: '1 рабочий день',
      },
      {
        id: 'ls05-2',
        order: 2,
        title: 'Оплатить пошлину онлайн',
        description: 'Пошлина оплачивается сразу при подаче — без визита в банк.',
        serviceId: '3-04-01',
        agencyId: 'mns',
        estimatedTime: 'Сразу',
      },
      {
        id: 'ls05-3',
        order: 3,
        title: 'Прийти на церемонию',
        description:
          'Церемония проходит в ЗАГС — это единственный офлайн-этап. Свидетельство можно получить в кабинете.',
        externalAction: 'Прийти в ЗАГС в назначенную дату',
        agencyId: 'justice',
        estimatedTime: '30 минут',
      },
      {
        id: 'ls05-4',
        order: 4,
        title: 'Заявление на развод (если нужно)',
        description:
          'При отсутствии общих несовершеннолетних детей развод можно оформить онлайн.',
        serviceId: 'ls-05-divorce-online',
        agencyId: 'justice',
        estimatedTime: '1 месяц',
        isOptional: true,
      },
    ],
    faq: [
      {
        question: 'Нужно ли идти в ЗАГС, чтобы подать заявление?',
        answer:
          'Нет. Подача заявления и оплата пошлины — онлайн. Личное присутствие нужно только на церемонии.',
      },
    ],
  },
  {
    id: 'ls-06-pets',
    registryId: 'LS-06',
    title: 'Регистрация домашних животных',
    painPoint:
      'Завели питомца — нужно зарегистрировать и получить ветеринарный паспорт, но непонятно, куда идти.',
    outcome: 'Питомец зарегистрирован, ветеринарный паспорт — в кабинете.',
    digitalState: 'red',
    priority: 'P2',
    gap: 'Заявлен запуск на портале; нужен маршрут «регистрация + ветпаспорт»',
    xcDeps: ['XC-01', 'XC-06'],
    categoryIds: ['family', 'other'],
    steps: [
      {
        id: 'ls06-1',
        order: 1,
        title: 'Зарегистрировать питомца',
        description:
          'Заполните данные о животном. Если есть прививки — приложите отметки.',
        serviceId: 'ls-06-pet-registration',
        agencyId: 'minselhoz',
        estimatedTime: '3 рабочих дня',
      },
      {
        id: 'ls06-2',
        order: 2,
        title: 'Получить ветеринарный паспорт',
        description:
          'Паспорт появится в «Моих услугах» — в электронном виде. Бумажный не нужен.',
        serviceId: 'ls-06-pet-registration',
        agencyId: 'minselhoz',
        estimatedTime: 'Сразу после регистрации',
      },
      {
        id: 'ls06-3',
        order: 3,
        title: 'Отметки о прививках',
        description:
          'Если делали прививки в ветклинике — они подтянутся автоматически. Если нет — можно приложить фото справки.',
        externalAction: 'Приложить справку о прививках в «Репозиторий документов»',
        agencyId: 'minselhoz',
        estimatedTime: '5 минут',
        isOptional: true,
      },
    ],
  },
  {
    id: 'ls-09-housing',
    registryId: 'LS-09',
    title: 'Улучшение жилищных условий',
    painPoint:
      'Хотите встать в очередь на жильё, но нужно собрать кучу справок о составе семьи и жилье.',
    outcome:
      'Вы в очереди на улучшение жилищных условий, справки собраны автоматически.',
    digitalState: 'yellow',
    priority: 'P2',
    gap: 'Справки о составе семьи и жилье — не всегда автоматически',
    xcDeps: ['XC-01', 'XC-06'],
    categoryIds: ['housing', 'family'],
    steps: [
      {
        id: 'ls09-1',
        order: 1,
        title: 'Получить справку о жилье и составе семьи',
        description:
          'Справка подтянется из регистра населения — вручную заполнять ничего не нужно.',
        serviceId: 'ls-09-housing-cert',
        agencyId: 'mvd',
        estimatedTime: '3 рабочих дня',
      },
      {
        id: 'ls09-2',
        order: 2,
        title: 'Встать на учёт нуждающихся',
        description:
          'Подайте заявление на постановку в очередь. Данные о жилье и составе семьи уже в системе.',
        serviceId: 'ls-09-housing-improvement',
        agencyId: 'goskomim',
        estimatedTime: '15 рабочих дней',
      },
      {
        id: 'ls09-3',
        order: 3,
        title: 'Проверить статус в очереди',
        description: 'Узнайте, на каком месте вы находитесь.',
        serviceId: '200-1-3-1',
        agencyId: 'goskomim',
        estimatedTime: 'Сразу',
        isOptional: true,
      },
    ],
  },
  {
    id: 'ls-10-employment',
    registryId: 'LS-10',
    title: 'Трудоустройство / статус безработного',
    painPoint:
      'Потеряли работу — не понимаете, какие сервисы помогут найти новую и как встать на учёт.',
    outcome:
      'Вы зарегистрированы как безработный, получаете пособие и видите вакансии.',
    digitalState: 'yellow',
    priority: 'P2',
    gap: 'Разрозненные сервисы → единый маршрут',
    xcDeps: ['XC-01', 'XC-06'],
    categoryIds: ['work', 'social'],
    steps: [
      {
        id: 'ls10-1',
        order: 1,
        title: 'Проверить данные о стаже и увольнении',
        description:
          'Данные о работе подтянутся из ФСЗН — вручную ничего заполнять не нужно.',
        serviceId: '3-25-03',
        agencyId: 'mintrud',
        estimatedTime: '3 рабочих дня',
      },
      {
        id: 'ls10-2',
        order: 2,
        title: 'Зарегистрироваться безработным',
        description:
          'Подайте заявление онлайн — данные о стаже и увольнении уже в системе.',
        serviceId: 'ls-10-unemployment-status',
        agencyId: 'mintrud',
        estimatedTime: '1 день',
      },
      {
        id: 'ls10-3',
        order: 3,
        title: 'Получить справку о регистрации',
        description:
          'Справка о том, что вы зарегистрированы как безработный — в кабинете.',
        serviceId: '200-2-31ф',
        agencyId: 'mintrud',
        estimatedTime: '1 рабочий день',
        isOptional: true,
      },
    ],
  },
  {
    id: 'ls-11-healthcare',
    registryId: 'LS-11',
    title: 'Медицина: диспансеризация, электронный рецепт',
    painPoint:
      'Чтобы записаться к врачу или получить рецепт, нужно идти в поликлинику и стоять в очереди.',
    outcome:
      'Запись к врачу — онлайн, рецепт — электронный, медкарта доступна в кабинете.',
    digitalState: 'yellow',
    priority: 'P2',
    gap: 'Электронная медкарта, запись (особенно в сельской местности)',
    xcDeps: ['XC-01', 'XC-05'],
    categoryIds: ['health', 'social'],
    steps: [
      {
        id: 'ls11-1',
        order: 1,
        title: 'Записаться к врачу онлайн',
        description:
          'Выберите поликлинику, врача и слот — без звонка в регистратуру.',
        serviceId: 'ls-11-appointment',
        agencyId: 'minzdrav',
        estimatedTime: 'Сразу',
      },
      {
        id: 'ls11-2',
        order: 2,
        title: 'Получить электронный рецепт',
        description:
          'Врач выписывает рецепт в электронной медкарте — он сразу появляется в кабинете.',
        serviceId: 'ls-11-e-prescription',
        agencyId: 'minzdrav',
        estimatedTime: 'Сразу',
      },
      {
        id: 'ls11-3',
        order: 3,
        title: 'Проверить медсправку',
        description:
          'Если нужна справка для работы или учёбы — сведения о ней уже в кабинете.',
        serviceId: '200-11-4',
        agencyId: 'minzdrav',
        estimatedTime: '1 рабочий день',
        isOptional: true,
      },
    ],
  },
    // ────────────────────────────────────────────────────────────────────────
  // Волна 2 (P2) — часть 2б: LS-25, LS-29, BS-03, BS-05, BS-06, BS-08, BS-10.
  // Юридические коды процедур — рабочие гипотезы, требуют верификации.
  // ────────────────────────────────────────────────────────────────────────
  {
    id: 'ls-25-family-capital',
    registryId: 'LS-25',
    title: 'Семейный капитал',
    painPoint:
      'Родился третий ребёнок — можно оформить семейный капитал, но для этого нужно ехать в исполком и собирать документы.',
    outcome: 'Семейный капитал назначен, деньги доступны на счёте.',
    digitalState: 'yellow',
    priority: 'P2',
    gap: 'Личное обращение и сбор документов',
    xcDeps: ['XC-01', 'XC-06'],
    categoryIds: ['family'],
    steps: [
      {
        id: 'ls25-1',
        order: 1,
        title: 'Проверить данные о детях',
        description:
          'Данные о всех детях подтянутся из регистра — вручную ничего заполнять не нужно.',
        serviceId: '3-39-02-2',
        agencyId: 'mintrud',
        estimatedTime: '3 рабочих дня',
      },
      {
        id: 'ls25-2',
        order: 2,
        title: 'Оформить семейный капитал',
        description:
          'Подайте заявление онлайн. Реквизиты счёта — из цифрового профиля.',
        serviceId: 'ls-25-family-capital',
        agencyId: 'mintrud',
        estimatedTime: '1 месяц',
      },
      {
        id: 'ls25-3',
        order: 3,
        title: 'Проверить назначение',
        description:
          'Решение о назначении — в «Моих услугах». Дальнейшие операции — через банк.',
        serviceId: '3-16-01',
        agencyId: 'mintrud',
        estimatedTime: 'Сразу',
        isOptional: true,
      },
    ],
  },
  {
    id: 'ls-29-ev-charger',
    registryId: 'LS-29',
    title: 'Установка зарядной станции для электромобиля',
    painPoint:
      'Купили электромобиль, а установка станции — это согласования с энергокомпанией, землепользователем и исполкомом.',
    outcome: 'Станция установлена, договор с энергокомпанией заключён.',
    digitalState: 'red',
    priority: 'P2',
    gap: 'Нет сквозного маршрута',
    xcDeps: ['XC-06', 'XC-07'],
    categoryIds: ['transport', 'housing'],
    steps: [
      {
        id: 'ls29-1',
        order: 1,
        title: 'Согласовать установку',
        description:
          'Подайте заявление онлайн. Согласование с землепользователем — автоматически.',
        serviceId: 'ls-29-ev-charger',
        agencyId: 'minenergo',
        estimatedTime: '30 дней',
      },
      {
        id: 'ls29-2',
        order: 2,
        title: 'Заключить договор с энергокомпанией',
        description:
          'Договор на подключение к электросетям — в электронном виде.',
        externalAction: 'Подписать договор с энергокомпанией',
        agencyId: 'minenergo',
        estimatedTime: '10 дней',
      },
      {
        id: 'ls29-3',
        order: 3,
        title: 'Установить станцию',
        description:
          'Монтаж выполняет аккредитованная организация — реестр доступен в кабинете.',
        externalAction: 'Заказать монтаж станции',
        agencyId: 'minenergo',
        estimatedTime: '1–2 дня',
        isOptional: true,
      },
    ],
  },
  {
    id: 'bs-03-regulated-licenses',
    registryId: 'BS-03',
    title: 'Регистрация / лицензирование в регулируемых сферах',
    painPoint:
      'Хотите открыть магазин, аптеку или запустить сайт — и каждый раз новая инстанция и свой набор документов.',
    outcome:
      'Все нужные лицензии и регистрации — в одном месте, без бумаг.',
    digitalState: 'yellow',
    priority: 'P2',
    gap: 'Торговый реестр, бытовые услуги, сайты, адвокатура, ветеринария, риелторы, страховщики — разрозненно',
    xcDeps: ['XC-01', 'XC-06'],
    categoryIds: ['business', 'law'],
    steps: [
      {
        id: 'bs03-1',
        order: 1,
        title: 'Проверить требования',
        description:
          'Выберите вид деятельности — увидите все нужные лицензии и регистрации.',
        serviceId: '3-47-01',
        agencyId: 'justice',
        estimatedTime: 'Сразу',
      },
      {
        id: 'bs03-2',
        order: 2,
        title: 'Включиться в Торговый реестр',
        description:
          'Если открываете магазин — включение в Торговый реестр онлайн.',
        serviceId: 'bs-03-trade-registry',
        agencyId: 'minjust',
        estimatedTime: '5 рабочих дней',
      },
      {
        id: 'bs03-3',
        order: 3,
        title: 'Получить лицензию',
        description:
          'Если деятельность лицензируется — подайте заявление в одном окне.',
        serviceId: 'bs-03-license-get',
        agencyId: 'minjust',
        estimatedTime: '15 рабочих дней',
      },
      {
        id: 'bs03-4',
        order: 4,
        title: 'Зарегистрировать сайт',
        description:
          'Если запускаете сайт — регистрация информационного ресурса онлайн.',
        serviceId: 'bs-10-website-registration',
        agencyId: 'minsvyaz',
        estimatedTime: '10 рабочих дней',
        isOptional: true,
      },
    ],
  },
  {
    id: 'bs-05-eaeu-trade',
    registryId: 'BS-05',
    title: 'ВЭД / ЕАЭС',
    painPoint:
      'Хотите экспортировать или импортировать товар — таможня, документы, платежи, всё разное.',
    outcome: 'Декларация подана, платежи проведены, товар растаможен.',
    digitalState: 'yellow',
    priority: 'P2',
    gap: 'Межстрановой обмен документами',
    xcDeps: ['XC-06'],
    categoryIds: ['business', 'customs'],
    steps: [
      {
        id: 'bs05-1',
        order: 1,
        title: 'Проверить требования',
        description:
          'Узнайте, какие документы нужны для вашего товара — в кабинете.',
        serviceId: '3-67-03',
        agencyId: 'gtk',
        estimatedTime: 'Сразу',
      },
      {
        id: 'bs05-2',
        order: 2,
        title: 'Подать декларацию онлайн',
        description:
          'Заполните электронную декларацию — проверка автоматически.',
        serviceId: 'bs-05-customs-declaration',
        agencyId: 'gtk',
        estimatedTime: 'Сразу',
      },
      {
        id: 'bs05-3',
        order: 3,
        title: 'Оплатить таможенные платежи',
        description:
          'Оплата — через ЕРИП, без визита в банк.',
        serviceId: '3-04-01',
        agencyId: 'mns',
        estimatedTime: 'Сразу',
      },
    ],
  },
  {
    id: 'bs-06-foreign-workers',
    registryId: 'BS-06',
    title: 'Регистрация иностранных работников',
    painPoint:
      'Наняли иностранца — нужно уведомить МВД и продлить срок пребывания, а это офлайн.',
    outcome:
      'Уведомление подано, срок пребывания продлён, работник может работать легально.',
    digitalState: 'red',
    priority: 'P2',
    gap: 'Уведомления и продление — офлайн',
    xcDeps: ['XC-01', 'XC-06'],
    categoryIds: ['business', 'docs'],
    steps: [
      {
        id: 'bs06-1',
        order: 1,
        title: 'Уведомить МВД о найме',
        description:
          'Заполните уведомление онлайн — данные об иностранце подтянутся из регистра.',
        serviceId: 'bs-06-foreign-worker',
        agencyId: 'mvd',
        estimatedTime: '5 рабочих дней',
      },
      {
        id: 'bs06-2',
        order: 2,
        title: 'Продлить срок пребывания',
        description:
          'Продление — через тот же кабинет. Данные о работодателе — из ЕГР.',
        externalAction: 'Оформить продление пребывания иностранца',
        agencyId: 'mvd',
        estimatedTime: '5 рабочих дней',
      },
      {
        id: 'bs06-3',
        order: 3,
        title: 'Проверить статус',
        description:
          'Статус уведомления и продления — в «Моих услугах».',
        serviceId: '3-29-01',
        agencyId: 'mvd',
        estimatedTime: 'Сразу',
        isOptional: true,
      },
    ],
  },
  {
    id: 'bs-08-construction',
    registryId: 'BS-08',
    title: 'Разрешительная документация в строительстве',
    painPoint:
      'Строите или реконструируете объект — нужно согласовать проект с СЭС, МЧС и Минстройархитектуры.',
    outcome: 'Разрешение на строительство получено, можно начинать работы.',
    digitalState: 'red',
    priority: 'P2',
    gap: '~10% оставшихся процедур — строительные',
    xcDeps: ['XC-06'],
    categoryIds: ['housing', 'business'],
    steps: [
      {
        id: 'bs08-1',
        order: 1,
        title: 'Подготовить проектную документацию',
        description:
          'Проект нужен для получения разрешения. Можно загрузить в репозиторий.',
        externalAction: 'Загрузить проектную документацию в «Репозиторий»',
        agencyId: 'mas',
        estimatedTime: 'по проекту',
      },
      {
        id: 'bs08-2',
        order: 2,
        title: 'Получить разрешение на строительство',
        description:
          'Подайте заявление онлайн — согласования с СЭС и МЧС пройдут автоматически.',
        serviceId: 'bs-08-construction-permit',
        agencyId: 'mas',
        estimatedTime: '30 дней',
      },
      {
        id: 'bs08-3',
        order: 3,
        title: 'Согласовать с СЭС и МЧС',
        description:
          'Дополнительные согласования — если объект нестандартный.',
        externalAction: 'Получить согласование СЭС / МЧС',
        agencyId: 'minzdrav',
        estimatedTime: '15 дней',
        isOptional: true,
      },
    ],
  },
  {
    id: 'bs-10-website-registration',
    registryId: 'BS-10',
    title: 'Регистрация интернет-сайтов / информационных ресурсов',
    painPoint:
      'Запустили сайт — нужно зарегистрировать его как информационный ресурс, но непонятно, куда идти.',
    outcome: 'Сайт зарегистрирован, свидетельство — в кабинете.',
    digitalState: 'yellow',
    priority: 'P2',
    gap: 'Частично; включить в BS-03',
    xcDeps: ['XC-01'],
    categoryIds: ['business', 'internet'],
    steps: [
      {
        id: 'bs10-1',
        order: 1,
        title: 'Зарегистрировать сайт',
        description:
          'Подайте заявление онлайн — данные о владельце подтянутся из ЕГР.',
        serviceId: 'bs-10-website-registration',
        agencyId: 'minsvyaz',
        estimatedTime: '10 рабочих дней',
      },
      {
        id: 'bs10-2',
        order: 2,
        title: 'Проверить реестр информационных ресурсов',
        description:
          'Убедитесь, что сайт попал в реестр — сведения доступны в кабинете.',
        serviceId: '3-13-03',
        agencyId: 'nces',
        estimatedTime: 'Сразу',
        isOptional: true,
      },
      {
        id: 'bs10-3',
        order: 3,
        title: 'Уведомить о смене домена',
        description:
          'Если меняете домен — подайте уведомление онлайн.',
        externalAction: 'Подать уведомление о смене домена',
        agencyId: 'minsvyaz',
        estimatedTime: '5 рабочих дней',
        isOptional: true,
      },
    ],
  },
    // ────────────────────────────────────────────────────────────────────────
  // Волна 3 (P3): LS-04, LS-14, LS-17, LS-26, LS-27, LS-28, LS-30, BS-09.
  // Институционально сложные: комиссии, экспертиза, суд.
  // Юридические коды процедур — рабочие гипотезы, требуют верификации.
  // ────────────────────────────────────────────────────────────────────────
  {
    id: 'ls-04-guardianship',
    registryId: 'LS-04',
    title: 'Опека над несовершеннолетними',
    painPoint:
      'Нужно оформить опеку над ребёнком — комиссия, документы, личное присутствие.',
    outcome: 'Опека установлена, ребёнок под защитой.',
    digitalState: 'red',
    priority: 'P3',
    gap: 'Комиссионное решение — требует личного присутствия',
    xcDeps: ['XC-01', 'XC-06'],
    categoryIds: ['family', 'social'],
    steps: [
      {
        id: 'ls04-1',
        order: 1,
        title: 'Подать заявление в орган опеки',
        description:
          'Заполните заявление онлайн. Документы можно приложить в электронном виде.',
        serviceId: 'ls-04-guardianship',
        agencyId: 'minedu',
        estimatedTime: '1 день',
      },
      {
        id: 'ls04-2',
        order: 2,
        title: 'Собрать документы',
        description:
          'Справки о доходах, жилье, здоровье — часть подтянется автоматически, часть нужно приложить.',
        externalAction: 'Собрать пакет документов',
        agencyId: 'minedu',
        estimatedTime: '10 дней',
      },
      {
        id: 'ls04-3',
        order: 3,
        title: 'Комиссия рассматривает заявление',
        description:
          'Очное заседание комиссии — единственный офлайн-этап.',
        externalAction: 'Прийти на заседание комиссии',
        agencyId: 'minedu',
        estimatedTime: '30 дней',
      },
    ],
  },
  {
    id: 'ls-14-inheritance',
    registryId: 'LS-14',
    title: 'Наследство',
    painPoint:
      'Умер близкий — нужно оформить наследство, а это нотариус, БТИ, банки, оценка имущества.',
    outcome: 'Свидетельство о праве на наследство получено, права зарегистрированы.',
    digitalState: 'red',
    priority: 'P3',
    gap: 'Нотариальные действия и оценка имущества — офлайн',
    xcDeps: ['XC-01'],
    categoryIds: ['law', 'family'],
    steps: [
      {
        id: 'ls14-1',
        order: 1,
        title: 'Обратиться к нотариусу',
        description:
          'Подайте заявление нотариусу по месту открытия наследства.',
        serviceId: 'ls-14-inheritance',
        agencyId: 'minjust',
        estimatedTime: '1 день',
      },
      {
        id: 'ls14-2',
        order: 2,
        title: 'Оценить имущество',
        description:
          'Оценка недвижимости и другого имущества — через аттестованного оценщика.',
        externalAction: 'Заказать оценку имущества',
        agencyId: 'goskomim',
        estimatedTime: '5 дней',
      },
      {
        id: 'ls14-3',
        order: 3,
        title: 'Зарегистрировать права',
        description:
          'Регистрация перехода прав на недвижимость — после получения свидетельства.',
        serviceId: 'ls-15-real-estate-deal',
        agencyId: 'goskomim',
        estimatedTime: '5–15 дней',
        isOptional: true,
      },
    ],
  },
  {
    id: 'ls-17-minor-property',
    registryId: 'LS-17',
    title: 'Отчуждение жилья с участием несовершеннолетних',
    painPoint:
      'Продаёте квартиру, где прописан ребёнок — нужно разрешение опеки, а это личное присутствие.',
    outcome: 'Разрешение опеки получено, сделка проведена.',
    digitalState: 'red',
    priority: 'P3',
    gap: 'Требуется личное присутствие / доверенность',
    xcDeps: ['XC-06'],
    categoryIds: ['housing', 'family'],
    steps: [
      {
        id: 'ls17-1',
        order: 1,
        title: 'Получить разрешение опеки',
        description:
          'Подайте заявление. Приложите согласие ребёнка (если 10+ лет) и документы на жильё.',
        serviceId: 'ls-17-minor-property-deal',
        agencyId: 'minedu',
        estimatedTime: '30 дней',
      },
      {
        id: 'ls17-2',
        order: 2,
        title: 'Проверить объект недвижимости',
        description:
          'Убедитесь, что у квартиры нет обременений.',
        serviceId: 'ls-15-property-check',
        agencyId: 'goskomim',
        estimatedTime: 'Сразу',
      },
      {
        id: 'ls17-3',
        order: 3,
        title: 'Зарегистрировать сделку',
        description:
          'Регистрация перехода прав — после получения разрешения опеки.',
        serviceId: 'ls-15-real-estate-deal',
        agencyId: 'goskomim',
        estimatedTime: '5–15 дней',
        isOptional: true,
      },
    ],
  },
  {
    id: 'ls-26-adoption',
    registryId: 'LS-26',
    title: 'Усыновление',
    painPoint:
      'Хотите усыновить ребёнка — суд, проверка условий, сбор документов.',
    outcome: 'Решение суда об усыновлении вступило в силу.',
    digitalState: 'red',
    priority: 'P3',
    gap: 'Суд + проверка условий — офлайн',
    xcDeps: ['XC-01'],
    categoryIds: ['family', 'social'],
    steps: [
      {
        id: 'ls26-1',
        order: 1,
        title: 'Подать заявление в опеку',
        description:
          'Заполните заявление онлайн. Приложите документы.',
        serviceId: 'ls-26-adoption',
        agencyId: 'minedu',
        estimatedTime: '1 день',
      },
      {
        id: 'ls26-2',
        order: 2,
        title: 'Проверка условий жизни',
        description:
          'Орган опеки проверяет условия — это офлайн-этап.',
        externalAction: 'Пройти проверку условий',
        agencyId: 'minedu',
        estimatedTime: '10 дней',
      },
      {
        id: 'ls26-3',
        order: 3,
        title: 'Суд',
        description:
          'Суд принимает решение об усыновлении. После — регистрация в ЗАГС.',
        externalAction: 'Прийти на заседание суда',
        agencyId: 'minjust',
        estimatedTime: '3 месяца',
      },
    ],
  },
  {
    id: 'ls-27-difficult-situation',
    registryId: 'LS-27',
    title: 'Трудная жизненная ситуация',
    painPoint:
      'Оказались в трудной ситуации — нужна адресная помощь, но комиссия рассматривает заявление очно.',
    outcome: 'Адресная помощь оказана.',
    digitalState: 'red',
    priority: 'P3',
    gap: 'Очное заседание комиссии',
    xcDeps: ['XC-06'],
    categoryIds: ['family', 'social'],
    steps: [
      {
        id: 'ls27-1',
        order: 1,
        title: 'Подать заявление',
        description:
          'Заполните заявление онлайн. Приложите документы, подтверждающие ситуацию.',
        serviceId: 'ls-27-difficult-situation',
        agencyId: 'mintrud',
        estimatedTime: '1 день',
      },
      {
        id: 'ls27-2',
        order: 2,
        title: 'Комиссия рассматривает',
        description:
          'Очное заседание комиссии — единственный офлайн-этап.',
        externalAction: 'Прийти на заседание комиссии',
        agencyId: 'mintrud',
        estimatedTime: '30 дней',
      },
      {
        id: 'ls27-3',
        order: 3,
        title: 'Получить помощь',
        description:
          'Решение комиссии — в кабинете, выплата — на счёт.',
        serviceId: '3-16-02',
        agencyId: 'mintrud',
        estimatedTime: '10 дней',
        isOptional: true,
      },
    ],
  },
  {
    id: 'ls-28-tree-removal',
    registryId: 'LS-28',
    title: 'Валка дерева',
    painPoint:
      'Нужно убрать дерево на участке — требуется разрешение, а комиссия выезжает на место.',
    outcome: 'Разрешение на валку дерева получено.',
    digitalState: 'red',
    priority: 'P3',
    gap: 'Разрешение + выезд комиссии',
    xcDeps: ['XC-06'],
    categoryIds: ['housing', 'other'],
    steps: [
      {
        id: 'ls28-1',
        order: 1,
        title: 'Подать заявление',
        description:
          'Заполните заявление онлайн. Приложите план участка и обоснование.',
        serviceId: 'ls-28-tree-removal',
        agencyId: 'minprirody',
        estimatedTime: '1 день',
      },
      {
        id: 'ls28-2',
        order: 2,
        title: 'Выезд комиссии',
        description:
          'Комиссия приезжает на место и оценивает — офлайн-этап.',
        externalAction: 'Встретить комиссию на участке',
        agencyId: 'minprirody',
        estimatedTime: '10 дней',
      },
      {
        id: 'ls28-3',
        order: 3,
        title: 'Получить разрешение',
        description:
          'Решение — в кабинете. Валка дерева — после получения разрешения.',
        serviceId: 'ls-28-tree-removal',
        agencyId: 'minprirody',
        estimatedTime: '5 дней',
        isOptional: true,
      },
    ],
  },
  {
    id: 'ls-30-hunting-dogs',
    registryId: 'LS-30',
    title: 'Регистрация охотничьих собак / ловчих птиц',
    painPoint:
      'Охотничью собаку или ловчую птицу нужно зарегистрировать, а услуга пока офлайн.',
    outcome: 'Свидетельство о регистрации получено.',
    digitalState: 'red',
    priority: 'P3',
    gap: 'Не оцифровано',
    xcDeps: ['XC-01'],
    categoryIds: ['other', 'agro'],
    steps: [
      {
        id: 'ls30-1',
        order: 1,
        title: 'Подать заявление',
        description:
          'Заполните заявление. Приложите документы о происхождении животного.',
        serviceId: 'ls-30-hunting-dogs',
        agencyId: 'minselhoz',
        estimatedTime: '1 день',
      },
      {
        id: 'ls30-2',
        order: 2,
        title: 'Проверка документов',
        description:
          'Документы проверяются в госинспекции — офлайн.',
        externalAction: 'Дождаться проверки документов',
        agencyId: 'minselhoz',
        estimatedTime: '5 дней',
      },
      {
        id: 'ls30-3',
        order: 3,
        title: 'Получить свидетельство',
        description:
          'Свидетельство выдаётся в отделении.',
        externalAction: 'Получить свидетельство лично',
        agencyId: 'minselhoz',
        estimatedTime: '5 дней',
        isOptional: true,
      },
    ],
  },
  {
    id: 'bs-09-patent',
    registryId: 'BS-09',
    title: 'Патент на изобретение',
    painPoint:
      'Хотите запатентовать изобретение — экспертиза долгая и офлайн.',
    outcome: 'Патент выдан, права защищены.',
    digitalState: 'red',
    priority: 'P3',
    gap: 'Экспертиза и подача — не полностью цифровые',
    xcDeps: ['XC-02'],
    categoryIds: ['ip', 'business'],
    steps: [
      {
        id: 'bs09-1',
        order: 1,
        title: 'Подать заявку',
        description:
          'Заполните заявку. Приложите описание изобретения.',
        serviceId: 'bs-09-patent',
        agencyId: 'ncis',
        estimatedTime: '1 день',
      },
      {
        id: 'bs09-2',
        order: 2,
        title: 'Экспертиза',
        description:
          'Экспертиза изобретения — офлайн-этап, может занять несколько месяцев.',
        externalAction: 'Дождаться экспертизы',
        agencyId: 'ncis',
        estimatedTime: 'по регламенту',
      },
      {
        id: 'bs09-3',
        order: 3,
        title: 'Получить патент',
        description:
          'Патент выдаётся после экспертизы. Можно получить в кабинете.',
        serviceId: 'bs-09-patent',
        agencyId: 'ncis',
        estimatedTime: 'по регламенту',
        isOptional: true,
      },
    ],
  },
]