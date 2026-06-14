import {
  AlignmentType,
  BorderStyle,
  Document,
  FileChild,
  ImageRun,
  Packer,
  PageBorderDisplay,
  PageBorderOffsetFrom,
  PageBorderZOrder,
  PageOrientation,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  Tab,
  TabStopType,
  TextRun,
  WidthType,
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

function createHeaderTable(schoolInfo: SchoolInfo): Table {
  const rows: TableRow[] = []
  const cellWidth = convertMillimetersToTwip(A4_WIDTH_MM - 2 * PAGE_MARGIN_MM) // 180mm

  const createCell = (paragraph: Paragraph) => {
    return new TableCell({
      children: [paragraph],
      width: {
        size: cellWidth,
        type: WidthType.DXA,
      },
      borders: {
        top: { style: BorderStyle.NONE },
        left: { style: BorderStyle.NONE },
        right: { style: BorderStyle.NONE },
        bottom: {
          style: BorderStyle.SINGLE,
          size: 6,
          color: 'D3D3D3',
        },
      },
      margins: {
        top: 100,
        bottom: 100,
        left: 0,
        right: 0,
      },
    });
  }

  // 1. Escola (All Caps)
  rows.push(
    new TableRow({
      children: [
        createCell(
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: toUppercase(schoolInfo.schoolName),
                bold: true,
                font: DOCUMENT_FONT,
                size: DOCUMENT_FONT_SIZE,
              }),
            ],
          }),
        ),
      ],
    }),
  )

  // 2. Diretora (optional)
  if (schoolInfo.directorName.trim()) {
    rows.push(
      new TableRow({
        children: [
          createCell(
            new Paragraph({
              alignment: AlignmentType.LEFT,
              children: [
                new TextRun({
                  text: 'DIRETORA: ',
                  bold: true,
                  font: DOCUMENT_FONT,
                  size: DOCUMENT_FONT_SIZE,
                }),
                new TextRun({
                  text: toUppercase(schoolInfo.directorName),
                  font: DOCUMENT_FONT,
                  size: DOCUMENT_FONT_SIZE,
                }),
              ],
            }),
          ),
        ],
      }),
    )
  }

  // 3. Professora
  rows.push(
    new TableRow({
      children: [
        createCell(
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: 'PROFESSORA: ',
                bold: true,
                font: DOCUMENT_FONT,
                size: DOCUMENT_FONT_SIZE,
              }),
              new TextRun({
                text: toUppercase(schoolInfo.teacherName),
                font: DOCUMENT_FONT,
                size: DOCUMENT_FONT_SIZE,
              }),
            ],
          }),
        ),
      ],
    }),
  )

  // 4. Aluno
  rows.push(
    new TableRow({
      children: [
        createCell(
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: 'ALUNO(A): ',
                bold: true,
                font: DOCUMENT_FONT,
                size: DOCUMENT_FONT_SIZE,
              }),
              new TextRun({
                text: '______________________________________________________',
                font: DOCUMENT_FONT,
                size: DOCUMENT_FONT_SIZE,
              }),
            ],
          }),
        ),
      ],
    }),
  )

  // 5. Série & Data
  const grade = toUppercase(schoolInfo.gradeName)

  rows.push(
    new TableRow({
      children: [
        createCell(
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: `SÉRIE: ${grade}`,
                bold: true,
                font: DOCUMENT_FONT,
                size: DOCUMENT_FONT_SIZE,
              }),
              new Tab(),
              new TextRun({
                text: 'DATA: __ / __ / ____',
                bold: true,
                font: DOCUMENT_FONT,
                size: DOCUMENT_FONT_SIZE,
              }),
            ],
            tabStops: [
              {
                type: TabStopType.RIGHT,
                position: cellWidth,
              },
            ],
          }),
        ),
      ],
    }),
  )

  return new Table({
    width: {
      size: cellWidth,
      type: WidthType.DXA,
    },
    columnWidths: [cellWidth],
    borders: {
      top: { style: BorderStyle.NONE },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
      bottom: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.NONE },
      insideVertical: { style: BorderStyle.NONE },
    },
    rows,
  })
}

export async function generateDocx(
  schoolInfo: SchoolInfo,
  activities: Activity[],
): Promise<Blob> {
  const children: FileChild[] = []

  if (schoolInfo.headerImage) {
    const headerImage = await prepareImage(schoolInfo.headerImage)
    children.push(createImageParagraph(headerImage, 120))
  }

  children.push(createHeaderTable(schoolInfo))

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
            borders: {
              pageBorderTop: {
                style: BorderStyle.SINGLE,
                size: 8,
                color: '000000',
                space: 4,
              },
              pageBorderBottom: {
                style: BorderStyle.SINGLE,
                size: 8,
                color: '000000',
                space: 4,
              },
              pageBorderLeft: {
                style: BorderStyle.SINGLE,
                size: 8,
                color: '000000',
                space: 4,
              },
              pageBorderRight: {
                style: BorderStyle.SINGLE,
                size: 8,
                color: '000000',
                space: 4,
              },
              pageBorders: {
                display: PageBorderDisplay.ALL_PAGES,
                offsetFrom: PageBorderOffsetFrom.TEXT,
                zOrder: PageBorderZOrder.FRONT,
              },
            },
          },
        },
        children,
      },
    ],
  })

  return Packer.toBlob(document)
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
