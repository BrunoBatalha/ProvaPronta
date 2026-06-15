import type { CropArea } from '../types/document'

const MAX_OUTPUT_EDGE = 2400
const JPEG_QUALITY = 0.92

export async function createCroppedImageFile(
  sourceUrl: string,
  sourceFile: File,
  cropArea: CropArea,
): Promise<File> {
  const image = await loadImage(sourceUrl)
  const scale = Math.min(
    1,
    MAX_OUTPUT_EDGE / Math.max(cropArea.width, cropArea.height),
  )
  const outputWidth = Math.max(1, Math.round(cropArea.width * scale))
  const outputHeight = Math.max(1, Math.round(cropArea.height * scale))
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')

  if (!context) {
    throw new Error('Não foi possível preparar o recorte da imagem.')
  }

  canvas.width = outputWidth
  canvas.height = outputHeight
  context.imageSmoothingEnabled = true
  context.imageSmoothingQuality = 'high'
  context.drawImage(
    image,
    cropArea.x,
    cropArea.y,
    cropArea.width,
    cropArea.height,
    0,
    0,
    outputWidth,
    outputHeight,
  )

  const outputType = sourceFile.type === 'image/png' ? 'image/png' : 'image/jpeg'
  const blob = await canvasToBlob(canvas, outputType)
  const extension = outputType === 'image/png' ? 'png' : 'jpg'
  const baseName = sourceFile.name.replace(/\.[^.]+$/, '') || 'atividade'

  return new File([blob], `${baseName}-recortada.${extension}`, {
    type: outputType,
    lastModified: Date.now(),
  })
}

function loadImage(sourceUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()

    image.onload = () => resolve(image)
    image.onerror = () =>
      reject(new Error('Não foi possível carregar a imagem selecionada.'))
    image.src = sourceUrl
  })
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob)
          return
        }

        reject(new Error('Não foi possível criar a imagem recortada.'))
      },
      type,
      type === 'image/jpeg' ? JPEG_QUALITY : undefined,
    )
  })
}
