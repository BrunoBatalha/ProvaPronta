const DEFAULT_DOCX_FILE_NAME = 'prova-pronta'

export function sanitizeDocxFileName(value: string): string {
  const sanitizedValue = value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

  return sanitizedValue || DEFAULT_DOCX_FILE_NAME
}
