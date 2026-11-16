import type { CareerProfileId } from '../types/dalon'

/*
 * Тест на профориентацию и подбор учебных заведений.
 * ВСЁ ЗДЕСЬ — УСЛОВНЫЕ ДАННЫЕ для прототипа, не официальный перечень:
 * названия учреждений и специальностей придуманы по образцу настоящих.
 */

export const CAREER_DISCLAIMER = 'Условные данные, не официальный перечень.'

export interface CareerProfile {
  id: CareerProfileId
  title: string
  text: string
  /** Направления после 9 класса — колледж (ССУЗ). */
  college: string[]
  /** Направления после 11 класса — вуз. */
  university: string[]
  /** Что сдавать на ЦТ / ЦЭ для этого профиля (подсказка, уточнить в правилах приёма). */
  subjects: string[]
}

export const CAREER_PROFILES: Record<CareerProfileId, CareerProfile> = {
  tech: {
    id: 'tech',
    title: 'Техника и IT',
    text: 'Нравится разбираться, как всё устроено, собирать и чинить, писать программы.',
    college: [
      'Программирование и веб-разработка',
      'Электроника и робототехника',
      'Автомобильная техника',
    ],
    university: [
      'Информатика и программирование',
      'Компьютерная инженерия',
      'Робототехнические системы',
    ],
    subjects: ['Математика', 'Физика', 'Русский или белорусский язык'],
  },
  science: {
    id: 'science',
    title: 'Природа и наука',
    text: 'Интересно ставить опыты, наблюдать за природой, искать закономерности.',
    college: ['Лабораторный анализ', 'Агрономия', 'Ветеринария'],
    university: ['Биология', 'Химия и фармация', 'Экология и природопользование'],
    subjects: ['Биология', 'Химия', 'Русский или белорусский язык'],
  },
  people: {
    id: 'people',
    title: 'Люди и здоровье',
    text: 'Хочется помогать, учить, заботиться — работать с людьми, а не с техникой.',
    college: ['Сестринское дело', 'Дошкольное образование', 'Социальная работа'],
    university: ['Лечебное дело', 'Педагогика и психология', 'Физическая реабилитация'],
    subjects: ['Биология', 'Химия или обществоведение', 'Русский или белорусский язык'],
  },
  business: {
    id: 'business',
    title: 'Экономика и управление',
    text: 'Нравится считать, планировать, договариваться и доводить дело до результата.',
    college: ['Бухгалтерский учёт', 'Коммерческая деятельность', 'Логистика'],
    university: ['Экономика', 'Финансы и кредит', 'Менеджмент'],
    subjects: ['Математика', 'Иностранный язык', 'Русский или белорусский язык'],
  },
  creative: {
    id: 'creative',
    title: 'Творчество и дизайн',
    text: 'Тянет рисовать, придумывать, снимать, делать красиво и необычно.',
    college: ['Дизайн', 'Фотография и медиа', 'Декоративно-прикладное искусство'],
    university: ['Графический дизайн', 'Архитектура', 'Журналистика'],
    subjects: ['Творческий экзамен', 'Русский или белорусский язык', 'Предмет по профилю'],
  },
  society: {
    id: 'society',
    title: 'Право и общество',
    text: 'Интересны история, законы, справедливость, языки и то, как устроено общество.',
    college: ['Правоведение', 'Документоведение', 'Туризм и гостеприимство'],
    university: ['Правоведение', 'Международные отношения', 'Лингвистика'],
    subjects: [
      'Обществоведение или история Беларуси',
      'Иностранный язык',
      'Русский или белорусский язык',
    ],
  },
}

export interface CareerOption {
  text: string
  profile: CareerProfileId
}

export interface CareerQuestion {
  id: string
  text: string
  options: CareerOption[]
}

export const CAREER_QUESTIONS: CareerQuestion[] = [
  {
    id: 'q1',
    text: 'Свободный вечер. Что выберешь?',
    options: [
      { text: 'Собрать или починить что-нибудь', profile: 'tech' },
      { text: 'Посмотреть научно-популярное видео', profile: 'science' },
      { text: 'Встретиться с друзьями, помочь кому-то', profile: 'people' },
      { text: 'Нарисовать, снять ролик, сочинить', profile: 'creative' },
    ],
  },
  {
    id: 'q2',
    text: 'Какой школьный проект тебе ближе?',
    options: [
      { text: 'Сайт или игра для класса', profile: 'tech' },
      { text: 'Бюджет школьной ярмарки', profile: 'business' },
      { text: 'Дебаты о правах подростков', profile: 'society' },
      { text: 'Опыт с растениями на подоконнике', profile: 'science' },
    ],
  },
  {
    id: 'q3',
    text: 'Друзья чаще всего просят тебя…',
    options: [
      { text: 'Настроить телефон или ноутбук', profile: 'tech' },
      { text: 'Выслушать и посоветовать', profile: 'people' },
      { text: 'Оформить открытку или пост', profile: 'creative' },
      { text: 'Рассудить спор по-честному', profile: 'society' },
    ],
  },
  {
    id: 'q4',
    text: 'Какой предмет даётся легче остальных?',
    options: [
      { text: 'Математика или физика', profile: 'tech' },
      { text: 'Биология или химия', profile: 'science' },
      { text: 'История или обществоведение', profile: 'society' },
      { text: 'Иностранный язык', profile: 'business' },
    ],
  },
  {
    id: 'q5',
    text: 'Где хочется работать?',
    options: [
      { text: 'В лаборатории или на природе', profile: 'science' },
      { text: 'В больнице, школе, центре помощи', profile: 'people' },
      { text: 'В своей компании или банке', profile: 'business' },
      { text: 'В студии, редакции, театре', profile: 'creative' },
    ],
  },
  {
    id: 'q6',
    text: 'Что обиднее всего потерять?',
    options: [
      { text: 'Свой компьютер с проектами', profile: 'tech' },
      { text: 'Скетчбук с рисунками', profile: 'creative' },
      { text: 'Таблицу с накоплениями и планами', profile: 'business' },
      { text: 'Гербарий или коллекцию минералов', profile: 'science' },
    ],
  },
  {
    id: 'q7',
    text: 'В команде ты обычно…',
    options: [
      { text: 'Организуешь и распределяешь задачи', profile: 'business' },
      { text: 'Поддерживаешь тех, у кого не выходит', profile: 'people' },
      { text: 'Следишь, чтобы всё было по правилам', profile: 'society' },
      { text: 'Делаешь техническую часть', profile: 'tech' },
    ],
  },
  {
    id: 'q8',
    text: 'Какую книгу или канал выберешь?',
    options: [
      { text: 'Про космос и устройство мира', profile: 'science' },
      { text: 'Детектив про суд и расследование', profile: 'society' },
      { text: 'Про истории успеха и бизнес', profile: 'business' },
      { text: 'Про художников, кино и моду', profile: 'creative' },
    ],
  },
  {
    id: 'q9',
    text: 'Что бы ты сделал(а) для своего района?',
    options: [
      { text: 'Волонтёрский центр для пожилых', profile: 'people' },
      { text: 'Яркий мурал на стене', profile: 'creative' },
      { text: 'Умные фонари с датчиками', profile: 'tech' },
      { text: 'Сквер с редкими деревьями', profile: 'science' },
    ],
  },
  {
    id: 'q10',
    text: 'Что приятнее услышать?',
    options: [
      { text: '«Ты мне очень помог(ла)»', profile: 'people' },
      { text: '«Это было честно и справедливо»', profile: 'society' },
      { text: '«Отличная идея, давай запускать»', profile: 'business' },
      { text: '«Как ты это придумал(а)?»', profile: 'creative' },
    ],
  },
]

/* --- Учебные заведения (условные) --- */

export type EduLevel = 'college' | 'university'

export interface EduCity {
  id: string
  name: string
}

export const EDU_CITIES: EduCity[] = [
  { id: 'minsk', name: 'Минск' },
  { id: 'grodno', name: 'Гродно' },
  { id: 'brest', name: 'Брест' },
  { id: 'gomel', name: 'Гомель' },
  { id: 'vitebsk', name: 'Витебск' },
  { id: 'mogilev', name: 'Могилёв' },
]

export interface EduInstitution {
  id: string
  city: string
  level: EduLevel
  name: string
  /** Район или адрес — чтобы показать, что рядом с домом. */
  area: string
  profiles: CareerProfileId[]
}

type Template = { level: EduLevel; name: string; profiles: CareerProfileId[] }

const TEMPLATES: Template[] = [
  { level: 'college', name: 'Колледж цифровых технологий', profiles: ['tech'] },
  { level: 'college', name: 'Политехнический колледж', profiles: ['tech', 'business'] },
  { level: 'college', name: 'Медицинский колледж', profiles: ['people', 'science'] },
  { level: 'college', name: 'Педагогический колледж', profiles: ['people', 'society'] },
  { level: 'college', name: 'Колледж искусств и дизайна', profiles: ['creative'] },
  { level: 'college', name: 'Аграрно-технический колледж', profiles: ['science', 'tech'] },
  { level: 'college', name: 'Торгово-экономический колледж', profiles: ['business', 'society'] },
  { level: 'university', name: 'Технический университет', profiles: ['tech', 'business'] },
  {
    level: 'university',
    name: 'Классический университет',
    profiles: ['science', 'society', 'people'],
  },
  { level: 'university', name: 'Медицинский университет', profiles: ['people', 'science'] },
  { level: 'university', name: 'Экономический университет', profiles: ['business', 'society'] },
  { level: 'university', name: 'Академия искусств и архитектуры', profiles: ['creative'] },
]

/** Районы Минска для подписи «рядом с домом» — семья живёт в Московском районе. */
const MINSK_AREAS = ['Московский р-н', 'Фрунзенский р-н', 'Ленинский р-н', 'Советский р-н']

export const HOME_AREA = 'Московский р-н'

function cityGenitive(city: EduCity): string {
  const map: Record<string, string> = {
    minsk: 'г. Минска',
    grodno: 'г. Гродно',
    brest: 'г. Бреста',
    gomel: 'г. Гомеля',
    vitebsk: 'г. Витебска',
    mogilev: 'г. Могилёва',
  }
  return map[city.id] ?? city.name
}

/** Условный перечень: в каждом городе — колледжи и вузы по шаблонам. */
export const EDU_INSTITUTIONS: EduInstitution[] = EDU_CITIES.flatMap((city) =>
  TEMPLATES.map((t, i) => ({
    id: `${city.id}-${i}`,
    city: city.id,
    level: t.level,
    name: `${t.name} ${cityGenitive(city)}`,
    area: city.id === 'minsk' ? MINSK_AREAS[i % MINSK_AREAS.length] : 'в черте города',
    profiles: t.profiles,
  })),
)
