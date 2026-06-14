const MAX_HEADER_IMAGE_SIZE = 2 * 1024 * 1024
const ACCEPTED_HEADER_IMAGE_TYPES = new Set(['image/jpeg', 'image/png'])
const ACCEPTED_HEADER_IMAGE_EXTENSIONS = /\.(jpe?g|png)$/i

export function validateHeaderImage(file: File): string | undefined {
  const hasAcceptedType = ACCEPTED_HEADER_IMAGE_TYPES.has(file.type)
  const hasAcceptedFallbackExtension =
    file.type === '' && ACCEPTED_HEADER_IMAGE_EXTENSIONS.test(file.name)

  if (!hasAcceptedType && !hasAcceptedFallbackExtension) {
    return 'Use uma imagem em PNG, JPG ou JPEG.'
  }

  if (file.size > MAX_HEADER_IMAGE_SIZE) {
    return 'Essa imagem é muito grande. Envie uma imagem de até 2 MB.'
  }

  return undefined
}
