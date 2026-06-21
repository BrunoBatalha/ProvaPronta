import type {
  WeeklyLessonDay,
  WeeklyLessonMoment,
  WeeklyLessonPlan,
} from '../types/document'

export const DEFAULT_PERIODS_PER_DAY = 4
export const MIN_PERIODS_PER_DAY = 1
export const MAX_PERIODS_PER_DAY = 8
export const MAX_WEEKLY_PLAN_DAYS = 7

export function createInitialWeeklyLessonPlan(): WeeklyLessonPlan {
  return {
    teacherName: '',
    gradeName: '',
    periodsPerDay: DEFAULT_PERIODS_PER_DAY,
    days: [],
  }
}

export function createWeeklyLessonDays(
  startDate: Date,
  endDate: Date,
  periodsPerDay: number,
  previousDays: WeeklyLessonDay[] = [],
): WeeklyLessonDay[] {
  const previousDaysByKey = new Map(
    previousDays.map((day) => [toDateKey(day.date), day]),
  )

  return expandDateRange(startDate, endDate).map((date) => {
    const previousDay = previousDaysByKey.get(toDateKey(date))

    return {
      id: toDateKey(date),
      date,
      theme: previousDay?.theme ?? '',
      objective: previousDay?.objective ?? '',
      moments: createWeeklyLessonMoments(periodsPerDay, previousDay?.moments),
    }
  })
}

export function createWeeklyLessonMoments(
  periodsPerDay: number,
  previousMoments: WeeklyLessonMoment[] = [],
): WeeklyLessonMoment[] {
  const safePeriodsPerDay = clampPeriodsPerDay(periodsPerDay)
  const previousMomentsByPeriod = new Map(
    previousMoments.map((moment) => [moment.periodNumber, moment]),
  )

  return Array.from({ length: safePeriodsPerDay }, (_, index) => {
    const periodNumber = index + 1
    const previousMoment = previousMomentsByPeriod.get(periodNumber)

    return {
      id: `period-${periodNumber}`,
      periodNumber,
      content: previousMoment?.content ?? '',
      classExercises: previousMoment?.classExercises ?? '',
      skills: previousMoment?.skills ?? '',
    }
  })
}

export function validateWeeklyLessonPlan(plan: WeeklyLessonPlan): string[] {
  const errors: string[] = []

  if (!plan.startDate || !plan.endDate) {
    errors.push('Selecione o intervalo de dias do plano semanal.')
  }

  if (plan.startDate && plan.endDate && plan.endDate < plan.startDate) {
    errors.push('A data final precisa ser depois da data inicial.')
  }

  if (
    plan.startDate &&
    plan.endDate &&
    countDaysInRange(plan.startDate, plan.endDate) > MAX_WEEKLY_PLAN_DAYS
  ) {
    errors.push('Selecione no máximo 7 dias para o plano semanal.')
  }

  if (!Number.isInteger(plan.periodsPerDay)) {
    errors.push('Informe a quantidade de tempos por dia.')
  } else if (
    plan.periodsPerDay < MIN_PERIODS_PER_DAY ||
    plan.periodsPerDay > MAX_PERIODS_PER_DAY
  ) {
    errors.push('A quantidade de tempos deve ficar entre 1 e 8.')
  }

  if (!plan.teacherName.trim()) {
    errors.push('Informe o nome da professora.')
  }

  if (!plan.gradeName.trim()) {
    errors.push('Informe a série ou turma.')
  }

  if (plan.startDate && plan.endDate && plan.days.length === 0) {
    errors.push('Gere pelo menos um dia para o plano semanal.')
  }

  plan.days.forEach((day) => {
    const dayLabel = formatDatePtBr(day.date)

    if (!day.theme.trim()) {
      errors.push(`Informe o tema do dia ${dayLabel}.`)
    }

    if (!day.objective.trim()) {
      errors.push(`Informe o objetivo do dia ${dayLabel}.`)
    }

    day.moments.forEach((moment) => {
      const periodLabel = `${moment.periodNumber}º tempo do dia ${dayLabel}`

      if (!moment.content.trim()) {
        errors.push(`Informe o conteúdo do ${periodLabel}.`)
      }

      if (!moment.classExercises.trim()) {
        errors.push(`Informe os exercícios em classe do ${periodLabel}.`)
      }

      if (!moment.skills.trim()) {
        errors.push(`Informe as habilidades do ${periodLabel}.`)
      }
    })
  })

  return errors
}

export function expandDateRange(startDate: Date, endDate: Date): Date[] {
  const start = toLocalDate(startDate)
  const end = toLocalDate(endDate)
  const dates: Date[] = []

  for (
    const currentDate = start;
    currentDate <= end;
    currentDate.setDate(currentDate.getDate() + 1)
  ) {
    dates.push(new Date(currentDate))
  }

  return dates
}

export function countDaysInRange(startDate: Date, endDate: Date): number {
  if (endDate < startDate) {
    return 0
  }

  return expandDateRange(startDate, endDate).length
}

export function formatDatePtBr(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
}

export function formatDateForFileName(date: Date): string {
  return formatDatePtBr(date).replace(/\//g, '-')
}

export function clampPeriodsPerDay(periodsPerDay: number): number {
  if (!Number.isFinite(periodsPerDay)) {
    return DEFAULT_PERIODS_PER_DAY
  }

  return Math.min(
    MAX_PERIODS_PER_DAY,
    Math.max(MIN_PERIODS_PER_DAY, Math.trunc(periodsPerDay)),
  )
}

function toDateKey(date: Date): string {
  const localDate = toLocalDate(date)
  const year = localDate.getFullYear()
  const month = String(localDate.getMonth() + 1).padStart(2, '0')
  const day = String(localDate.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function toLocalDate(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}
