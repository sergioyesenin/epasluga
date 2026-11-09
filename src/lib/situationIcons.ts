/**
 * Единый источник эмодзи-иконок для жизненных ситуаций.
 * Используется в превью на главной и в каталоге.
 */
export const situationIcons: Record<string, string> = {
  birth: '👶',
  'buy-car': '🚗',
  university: '🎓',
  kindergarten: '🎒',
  retirement: '🧓',
  'start-business': '💼',
  'real-estate': '🏠',
  'change-residence': '📦',
  'loss-of-relative': '🕊️',
  'lost-documents': '🆔',
}

/** Безопасное получение иконки с фоллбэком. */
export function getSituationIcon(id: string): string {
  return situationIcons[id] ?? '📋'
}