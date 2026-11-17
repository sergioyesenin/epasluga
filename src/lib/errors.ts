/**
 * Чанк экрана не загрузился: нет сети и его нет в кэше, или после выхода новой версии
 * старый файл уже удалён с сервера. Лечится перезагрузкой, а не сбросом данных.
 */
export function isChunkLoadError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false
  }
  const text = `${error.name} ${error.message}`
  return (
    text.includes('Failed to fetch dynamically imported module') ||
    text.includes('error loading dynamically imported module') ||
    text.includes('Importing a module script failed') ||
    text.includes('ChunkLoadError')
  )
}

export function errorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  return String(error)
}
