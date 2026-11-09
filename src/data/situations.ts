import type { LifeSituation } from '../types/service';

export const lifeSituations: LifeSituation[] = [
  {
    id: 'birth',
    title: 'Рождение ребёнка',
    painPoint: 'Вы стали родителями и не знаете, какие документы нужно оформить в первую очередь.',
    outcome: 'Свидетельство о рождении получено, ребёнок прописан, пособия назначены.',
    categoryIds: ['family', 'social', 'docs'],
    steps: [
      {
        id: 'birth-1',
        order: 1,
        title: 'Зарегистрировать рождение в ЗАГС',
        description: 'Получите свидетельство о рождении. Это можно сделать в роддоме или онлайн.',
        serviceId: '200.5.1', // Из вашего CSV: Регистрация рождения
        agencyId: 'justice',
        estimatedTime: '1 день',
      },
      {
        id: 'birth-2',
        order: 2,
        title: 'Прописать ребёнка',
        description: 'Зарегистрируйте ребёнка по месту жительства родителей.',
        serviceId: '200.13.1', // Из вашего CSV: Регистрация по месту жительства
        agencyId: 'mvd',
        estimatedTime: '1-3 дня',
      },
      {
        id: 'birth-3',
        order: 3,
        title: 'Оформить пособие при рождении',
        description: 'Единовременная выплата от государства.',
        serviceId: '200.2.6', // Из вашего CSV: Назначение пособия в связи с рождением
        agencyId: 'mintrud',
        estimatedTime: 'до 10 дней',
      },
      {
        id: 'birth-4',
        order: 4,
        title: 'Оформить пособие по уходу до 3 лет',
        description: 'Ежемесячная выплата на ребёнка.',
        serviceId: '200.2.9', // Из вашего CSV: Пособие по уходу за ребенком до 3 лет
        agencyId: 'mintrud',
        estimatedTime: 'до 10 дней',
      },
      {
        id: 'birth-5',
        order: 5,
        title: 'Поставить в очередь в детский сад',
        description: 'Можно сделать сразу после получения свидетельства о рождении.',
        serviceId: '200.6.6', // Из вашего CSV: Постановка на учет детей в целях получения дошкольного образования
        agencyId: 'minedu',
        estimatedTime: '15 минут',
        isOptional: true,
      }
    ],
    faq: [
      {
        question: 'Что делать, если мы не состоим в браке?',
        answer: 'Потребуется совместное заявление в ЗАГС или установление отцовства через суд (если отец не согласен).'
      }
    ]
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
        title: 'Проверить автомобиль (VIN)',
        description: 'Убедитесь, что машина не в розыске и не в залоге.',
        serviceId: '3.59.01', // Из вашего CSV: Проверка нахождения ТС в розыске
        agencyId: 'mvd',
        estimatedTime: '5 минут',
      },
      {
        id: 'car-2',
        order: 2,
        title: 'Проверить наличие страховки (ОСАГО)',
        description: 'Убедитесь, что у продавца есть действующий полис.',
        serviceId: '3.53.01', // Из вашего CSV: Проверка договора ОСАГО
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
        serviceId: '200.15.11', // Из вашего CSV: Государственная регистрация ТС
        agencyId: 'mvd',
        estimatedTime: '1 день',
      }
    ],
    faq: []
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
        serviceId: '3.101.01', // Из вашего CSV: Получение сведений о документах об образовании
        agencyId: 'minedu',
        estimatedTime: '15 минут',
      },
      {
        id: 'uni-2',
        order: 2,
        title: 'Подать документы в приемную комиссию',
        description: 'В большинстве вузов это делается через личный кабинет абитуриента (не на Е-Паслуге).',
        externalAction: 'Подать документы на сайте вуза',
        agencyId: 'minedu',
        estimatedTime: '1 день',
      }
    ],
    faq: []
  }
];