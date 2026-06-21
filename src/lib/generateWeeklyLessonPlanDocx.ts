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
  SectionType,
  Tab,
  TabStopPosition,
  TabStopType,
  Table,
  TableCell,
  TableLayoutType,
  TableRow,
  TextRun,
  VerticalAlign,
  WidthType,
  convertMillimetersToTwip,
} from 'docx'
import cephLogoUrl from '../assets/logo-ceph.png'
import type { WeeklyLessonPlan } from '../types/document'
import { formatDatePtBr } from './weeklyLessonPlanUtils'

const A4_WIDTH_MM = 210
const A4_HEIGHT_MM = 297
const MARGIN_TOP_MM = 9.5
const MARGIN_BOTTOM_MM = 7.8
const MARGIN_LEFT_MM = 10
const MARGIN_RIGHT_MM = 10
const DOCUMENT_FONT = 'Arial'
const DOCUMENT_FONT_SIZE = 24
const CONTENT_WIDTH_TWIP = convertMillimetersToTwip(
  A4_WIDTH_MM - MARGIN_LEFT_MM - MARGIN_RIGHT_MM,
)
const DAY_HEADER_LOGO_WIDTH_TWIP = convertMillimetersToTwip(26)
const DAY_HEADER_TEXT_WIDTH_TWIP =
  CONTENT_WIDTH_TWIP - DAY_HEADER_LOGO_WIDTH_TWIP * 2
const DAY_HEADER_LOGO_LEFT_MARGIN_TWIP = 520
const DAY_HEADER_LOGO_WIDTH_PX = 78
const DAY_HEADER_LOGO_HEIGHT_PX = 52
const RESOURCES_LABEL = 'RECURSOS:'
const RESOURCES_OPTIONS =
  ' BIBLIOTECA(  )  SALA DE VÍDEO(  ) PLAYGROUND(  ) QUADRA(    ) OUTROS:SALA DE AULA'

export async function generateWeeklyLessonPlanDocx(
  plan: WeeklyLessonPlan,
): Promise<Blob> {
  const logoData = await loadCephLogo()

  const document = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: DOCUMENT_FONT,
            size: DOCUMENT_FONT_SIZE,
          },
          paragraph: {
            spacing: {
              after: 80,
            },
          },
        },
      },
    },
    sections: plan.days.map((day, dayIndex) => ({
      properties: createSectionProperties(dayIndex),
      children: createDayChildren(plan, day, logoData),
    })),
  })

  return Packer.toBlob(document)
}

function createDayChildren(
  plan: WeeklyLessonPlan,
  day: WeeklyLessonPlan['days'][number],
  logoData: ArrayBuffer,
): FileChild[] {
  const children: FileChild[] = [
    createDayHeaderTable(logoData, `DIA ${formatDatePtBr(day.date)}`),
    createLabelParagraph('1º MOMENTO', {
      bold: true,
      spacingAfter: 120,
    }),
    createValueParagraph('TEMA:', day.theme),
    createValueParagraph('OBJETIVO:', day.objective),
    createTeacherAndGradeParagraph(plan.teacherName, plan.gradeName),
    createSpacerParagraph(160),
  ]

  day.moments.forEach((moment, index, array) => {
    const isLastMoment = index === array.length - 1
    children.push(
      createLabelParagraph(`${moment.periodNumber}ºTEMPO:`, {
        bold: true,
        spacingBefore: moment.periodNumber === 1 ? 0 : 180,
        spacingAfter: 100,
      }),
      createValueParagraph('CONTEÚDO:', moment.content),
      createValueParagraph('EXERCÍCIOS EM CLASSE:', moment.classExercises),
      createValueParagraph(
        'HABILIDADES-(CAMPOS DE EXPERIÊNCIA):',
        moment.skills,
      ),
      createResourcesParagraph(isLastMoment),
    )
  })

  return children
}

function createSectionProperties(dayIndex: number) {
  const properties = {
    page: {
      size: {
        orientation: PageOrientation.PORTRAIT,
        width: convertMillimetersToTwip(A4_WIDTH_MM),
        height: convertMillimetersToTwip(A4_HEIGHT_MM),
      },
      margin: {
        top: convertMillimetersToTwip(MARGIN_TOP_MM),
        right: convertMillimetersToTwip(MARGIN_RIGHT_MM),
        bottom: convertMillimetersToTwip(MARGIN_BOTTOM_MM),
        left: convertMillimetersToTwip(MARGIN_LEFT_MM),
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
  }

  if (dayIndex === 0) {
    return properties
  }

  return {
    ...properties,
    type: SectionType.NEXT_PAGE,
  }
}

function createDayHeaderTable(logoData: ArrayBuffer, dayLabel: string): Table {
  return new Table({
    width: {
      size: CONTENT_WIDTH_TWIP,
      type: WidthType.DXA,
    },
    columnWidths: [
      DAY_HEADER_LOGO_WIDTH_TWIP,
      DAY_HEADER_TEXT_WIDTH_TWIP,
      DAY_HEADER_LOGO_WIDTH_TWIP,
    ],
    layout: TableLayoutType.FIXED,
    borders: {
      top: { style: BorderStyle.NONE },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
      bottom: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.NONE },
      insideVertical: { style: BorderStyle.NONE },
    },
    rows: [
      new TableRow({
        children: [
          createDayHeaderCell(
            new Paragraph({
              children: [
                new ImageRun({
                  type: 'png',
                  data: logoData,
                  transformation: {
                    width: DAY_HEADER_LOGO_WIDTH_PX,
                    height: DAY_HEADER_LOGO_HEIGHT_PX,
                  },
                }),
              ],
            }),
            DAY_HEADER_LOGO_WIDTH_TWIP,
            DAY_HEADER_LOGO_LEFT_MARGIN_TWIP,
          ),
          createDayHeaderCell(
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [createRun(dayLabel, true)],
            }),
            DAY_HEADER_TEXT_WIDTH_TWIP,
          ),
          createDayHeaderCell(
            new Paragraph({
              children: [createRun('')],
            }),
            DAY_HEADER_LOGO_WIDTH_TWIP,
          ),
        ],
      }),
    ],
  })
}

function createDayHeaderCell(
  paragraph: Paragraph,
  width: number,
  leftMargin = 0,
): TableCell {
  return new TableCell({
    children: [paragraph],
    width: {
      size: width,
      type: WidthType.DXA,
    },
    verticalAlign: VerticalAlign.CENTER,
    borders: {
      top: { style: BorderStyle.NONE },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
      bottom: { style: BorderStyle.NONE },
    },
    margins: {
      top: 0,
      bottom: 160,
      left: leftMargin,
      right: 0,
    },
  })
}

function createResourcesParagraph(isLastMoment = false): Paragraph {
  return new Paragraph({
    children: [createRun(RESOURCES_LABEL, true), createRun(RESOURCES_OPTIONS)],
    spacing: isLastMoment
      ? undefined
      : {
          after: 320,
        },
  })
}

function createValueParagraph(label: string, value: string): Paragraph {
  return new Paragraph({
    children: [createRun(label, true), createRun(` ${value.trim()}`)],
    spacing: {
      after: 90,
    },
  })
}

function createTeacherAndGradeParagraph(
  teacherName: string,
  gradeName: string,
): Paragraph {
  return new Paragraph({
    children: [
      createRun('PROFESSORA:', true),
      createRun(` ${teacherName.trim()}`),
      new TextRun({
        children: [new Tab()],
        font: DOCUMENT_FONT,
        size: DOCUMENT_FONT_SIZE,
      }),
      createRun('SÉRIE/TURMA:', true),
      createRun(` ${gradeName.trim()}`),
    ],
    spacing: {
      after: 180,
    },
    tabStops: [
      {
        type: TabStopType.RIGHT,
        position: TabStopPosition.MAX,
      },
    ],
  })
}

function createLabelParagraph(
  text: string,
  options: {
    alignment?: (typeof AlignmentType)[keyof typeof AlignmentType]
    bold?: boolean
    spacingBefore?: number
    spacingAfter?: number
  } = {},
): Paragraph {
  return new Paragraph({
    alignment: options.alignment,
    children: [createRun(text, options.bold)],
    spacing: {
      before: options.spacingBefore,
      after: options.spacingAfter,
    },
  })
}

function createSpacerParagraph(spacingAfter: number): Paragraph {
  return new Paragraph({
    children: [createRun('')],
    spacing: {
      after: spacingAfter,
    },
  })
}

function createRun(text: string, bold = false): TextRun {
  return new TextRun({
    text,
    bold,
    font: DOCUMENT_FONT,
    size: DOCUMENT_FONT_SIZE,
  })
}

async function loadCephLogo(): Promise<ArrayBuffer> {
  const response = await fetch(cephLogoUrl)

  if (!response.ok) {
    throw new Error('Não foi possível carregar a logo do plano semanal.')
  }

  return response.arrayBuffer()
}
