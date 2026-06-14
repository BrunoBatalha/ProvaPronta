import {
  AlignmentType,
  Document,
  ImageRun,
  Packer,
  PageOrientation,
  Paragraph,
  TabStopPosition,
  TabStopType,
  TextRun,
  convertMillimetersToTwip,
} from 'docx'
import type { Activity, SchoolInfo } from '../types/document'

const A4_WIDTH_MM = 210
const A4_HEIGHT_MM = 297
const PAGE_MARGIN_MM = 15
const CONTENT_WIDTH_PX = 680
const DOCUMENT_FONT = 'Arial'
const DOCUMENT_FONT_SIZE = 24

type SupportedImageType = 'jpg' | 'png'

type ImageDimensions = {
  width: number
  height: number
}

type DocumentImage = ImageDimensions & {
  data: ArrayBuffer
  type: SupportedImageType
}

export function validateDocumentData(
  schoolInfo: SchoolInfo,
  activities: Activity[],
): string[] {
  const errors: string[] = []

  if (!schoolInfo.schoolName.trim()) {
    errors.push('Informe o nome da escola.')
  }

  if (!schoolInfo.teacherName.trim()) {
    errors.push('Informe o nome da professora.')
  }

  if (activities.length === 0) {
    errors.push('Adicione pelo menos uma atividade.')
    return errors
  }

  activities.forEach((activity, index) => {
    const activityNumber = index + 1

    if (!activity.statement.trim()) {
      errors.push(`Escreva o enunciado da atividade ${activityNumber}.`)
    }

    if (!activity.image) {
      errors.push(`Envie uma imagem para a atividade ${activityNumber}.`)
    }
  })

  return errors
}

export async function generateDocx(
  schoolInfo: SchoolInfo,
  activities: Activity[],
): Promise<Blob> {
  const children: Paragraph[] = []

  if (schoolInfo.headerImage) {
    const headerImage = await prepareImage(schoolInfo.headerImage)
    children.push(createImageParagraph(headerImage, 120))
  }

  children.push(createUppercaseParagraph(schoolInfo.schoolName, true))

  if (schoolInfo.directorName.trim()) {
    children.push(createLabelParagraph('DIRETORA', schoolInfo.directorName))
  }

  children.push(createLabelParagraph('PROFESSORA', schoolInfo.teacherName))
  children.push(createUppercaseParagraph('ALUNO(A):___________________________', true))
  children.push(createGradeAndDateParagraph(schoolInfo.gradeName))

  children.push(new Paragraph({ spacing: { after: 120 } }))

  for (const [index, activity] of activities.entries()) {
    if (!activity.image) {
      throw new Error(`A atividade ${index + 1} está sem imagem.`)
    }

    const activityImage = await prepareImage(activity.image)

    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `${index + 1}- ${activity.statement.trim()}`,
            bold: true,
            font: DOCUMENT_FONT,
            size: DOCUMENT_FONT_SIZE,
          }),
        ],
        spacing: {
          before: index === 0 ? 0 : 180,
          after: 120,
        },
      }),
      createImageParagraph(activityImage, 180),
    )
  }

  const document = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: DOCUMENT_FONT,
            size: DOCUMENT_FONT_SIZE,
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            size: {
              orientation: PageOrientation.PORTRAIT,
              width: convertMillimetersToTwip(A4_WIDTH_MM),
              height: convertMillimetersToTwip(A4_HEIGHT_MM),
            },
            margin: {
              top: convertMillimetersToTwip(PAGE_MARGIN_MM),
              right: convertMillimetersToTwip(PAGE_MARGIN_MM),
              bottom: convertMillimetersToTwip(PAGE_MARGIN_MM),
              left: convertMillimetersToTwip(PAGE_MARGIN_MM),
            },
          },
        },
        children,
      },
    ],
  })

  return Packer.toBlob(document)
}

function createLabelParagraph(label: string, value: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text: `${label}: `,
        bold: true,
        font: DOCUMENT_FONT,
        size: DOCUMENT_FONT_SIZE,
      }),
      new TextRun({
        text: toUppercase(value),
        font: DOCUMENT_FONT,
        size: DOCUMENT_FONT_SIZE,
      }),
    ],
    spacing: {
      after: 40,
    },
  })
}

function createUppercaseParagraph(text: string, bold = false): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text: toUppercase(text),
        bold,
        font: DOCUMENT_FONT,
        size: DOCUMENT_FONT_SIZE,
      }),
    ],
    spacing: {
      after: 40,
    },
  })
}

function createGradeAndDateParagraph(gradeName: string): Paragraph {
  const grade = toUppercase(gradeName)

  return new Paragraph({
    children: [
      new TextRun({
        text: `SÉRIE: ${grade}`,
        bold: true,
        font: DOCUMENT_FONT,
        size: DOCUMENT_FONT_SIZE,
      }),
      new TextRun({
        text: '\tDATA: __ / __ / ____',
        bold: true,
        font: DOCUMENT_FONT,
        size: DOCUMENT_FONT_SIZE,
      }),
    ],
    tabStops: [
      {
        type: TabStopType.RIGHT,
        position: TabStopPosition.MAX,
      },
    ],
    spacing: {
      after: 40,
    },
  })
}

function toUppercase(value: string): string {
  return value.trim().toLocaleUpperCase('pt-BR')
}

function createImageParagraph(
  image: DocumentImage,
  spacingAfter: number,
): Paragraph {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [
      new ImageRun({
        type: image.type,
        data: image.data,
        transformation: fitImageWithinWidth(image, CONTENT_WIDTH_PX),
      }),
    ],
    spacing: {
      after: spacingAfter,
    },
  })
}

async function prepareImage(file: File): Promise<DocumentImage> {
  const [data, dimensions] = await Promise.all([
    file.arrayBuffer(),
    getImageDimensions(file),
  ])

  return {
    data,
    type: getImageType(file),
    ...dimensions,
  }
}

function getImageType(file: File): SupportedImageType {
  if (file.type === 'image/png' || /\.png$/i.test(file.name)) {
    return 'png'
  }

  if (file.type === 'image/jpeg' || /\.jpe?g$/i.test(file.name)) {
    return 'jpg'
  }

  throw new Error('Formato de imagem não compatível com o documento.')
}

async function getImageDimensions(file: File): Promise<ImageDimensions> {
  if ('createImageBitmap' in window) {
    const bitmap = await createImageBitmap(file)

    try {
      return {
        width: bitmap.width,
        height: bitmap.height,
      }
    } finally {
      bitmap.close()
    }
  }

  return getImageDimensionsFromElement(file)
}

function getImageDimensionsFromElement(file: File): Promise<ImageDimensions> {
  const imageUrl = URL.createObjectURL(file)

  return new Promise((resolve, reject) => {
    const image = new Image()

    image.onload = () => {
      URL.revokeObjectURL(imageUrl)
      resolve({
        width: image.naturalWidth,
        height: image.naturalHeight,
      })
    }

    image.onerror = () => {
      URL.revokeObjectURL(imageUrl)
      reject(new Error('Não foi possível ler uma das imagens.'))
    }

    image.src = imageUrl
  })
}

function fitImageWithinWidth(
  dimensions: ImageDimensions,
  maxWidth: number,
): ImageDimensions {
  if (dimensions.width <= maxWidth) {
    return dimensions
  }

  const scale = maxWidth / dimensions.width

  return {
    width: Math.round(dimensions.width * scale),
    height: Math.round(dimensions.height * scale),
  }
}
