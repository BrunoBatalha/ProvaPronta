import { DatePicker, Portal, parseDate, type DateValue } from '@chakra-ui/react'
import type { ChangeEvent } from 'react'
import type {
  WeeklyLessonDay,
  WeeklyLessonMoment,
  WeeklyLessonPlan,
} from '../../types/document'
import {
  clampPeriodsPerDay,
  createWeeklyLessonDays,
  formatDatePtBr,
  MAX_PERIODS_PER_DAY,
  MIN_PERIODS_PER_DAY,
} from '../../lib/weeklyLessonPlanUtils'

type WeeklyLessonPlanFormProps = {
  value: WeeklyLessonPlan
  onChange: (value: WeeklyLessonPlan) => void
}

export function WeeklyLessonPlanForm({
  value,
  onChange,
}: WeeklyLessonPlanFormProps) {
  const datePickerValue = [
    value.startDate ? parseDate(formatDateForDatePicker(value.startDate)) : null,
    value.endDate ? parseDate(formatDateForDatePicker(value.endDate)) : null,
  ].filter(Boolean) as DateValue[]

  function handleDateRangeChange(dateValues: DateValue[]) {
    const [startDateValue, endDateValue] = dateValues
    const startDate = startDateValue
      ? dateValueToDate(startDateValue)
      : undefined
    const endDate = endDateValue ? dateValueToDate(endDateValue) : undefined

    onChange({
      ...value,
      startDate,
      endDate,
      days:
        startDate && endDate && endDate >= startDate
          ? createWeeklyLessonDays(
              startDate,
              endDate,
              value.periodsPerDay,
              value.days,
            )
          : [],
    })
  }

  function handleGlobalFieldChange(event: ChangeEvent<HTMLInputElement>) {
    onChange({
      ...value,
      [event.target.name]: event.target.value,
    })
  }

  function handlePeriodsPerDayChange(event: ChangeEvent<HTMLInputElement>) {
    const periodsPerDay = clampPeriodsPerDay(Number(event.target.value))

    onChange({
      ...value,
      periodsPerDay,
      days: value.days.map((day) => ({
        ...day,
        moments: createWeeklyLessonMomentsForDay(day, periodsPerDay),
      })),
    })
  }

  function handleDayChange(
    dayId: string,
    changes: Partial<Pick<WeeklyLessonDay, 'theme' | 'objective'>>,
  ) {
    onChange({
      ...value,
      days: value.days.map((day) =>
        day.id === dayId ? { ...day, ...changes } : day,
      ),
    })
  }

  function handleMomentChange(
    dayId: string,
    momentId: string,
    changes: Partial<
      Pick<WeeklyLessonMoment, 'content' | 'classExercises' | 'skills'>
    >,
  ) {
    onChange({
      ...value,
      days: value.days.map((day) =>
        day.id === dayId
          ? {
              ...day,
              moments: day.moments.map((moment) =>
                moment.id === momentId ? { ...moment, ...changes } : moment,
              ),
            }
          : day,
      ),
    })
  }

  return (
    <div className="weekly-plan-form">
      <div className="weekly-plan-form__intro">
        <div className="weekly-date-picker">
          <DatePicker.Root
            locale="pt-BR"
            selectionMode="range"
            value={datePickerValue}
            onValueChange={(details) => handleDateRangeChange(details.value)}
          >
            <DatePicker.Label className="weekly-date-picker__label">
              Intervalo de dias
            </DatePicker.Label>
            <DatePicker.Control className="weekly-date-picker__control">
              <DatePicker.Input
                className="weekly-date-picker__input"
                index={0}
                placeholder="Data inicial"
              />
              <DatePicker.Input
                className="weekly-date-picker__input"
                index={1}
                placeholder="Data final"
              />
              <DatePicker.Trigger className="weekly-date-picker__trigger">
                Abrir calendário
              </DatePicker.Trigger>
            </DatePicker.Control>
            <Portal>
              <DatePicker.Positioner>
                <DatePicker.Content className="weekly-date-picker__content">
                  <DatePicker.View view="day">
                    <DatePicker.Header />
                    <DatePicker.DayTable />
                  </DatePicker.View>
                  <DatePicker.View view="month">
                    <DatePicker.Header />
                    <DatePicker.MonthTable />
                  </DatePicker.View>
                  <DatePicker.View view="year">
                    <DatePicker.Header />
                    <DatePicker.YearTable />
                  </DatePicker.View>
                </DatePicker.Content>
              </DatePicker.Positioner>
            </Portal>
          </DatePicker.Root>
          <p className="form-field__help">
            Escolha até 7 dias. O formulário cria um bloco para cada dia.
          </p>
        </div>

        <div className="weekly-plan-form__fields">
          <div className="form-field">
            <div className="form-field__label-row">
              <label htmlFor="weekly-teacher-name">Professora</label>
              <span>Obrigatório</span>
            </div>
            <input
              id="weekly-teacher-name"
              name="teacherName"
              type="text"
              value={value.teacherName}
              onChange={handleGlobalFieldChange}
              placeholder="Ex.: Ana Souza"
              required
            />
          </div>

          <div className="form-field">
            <div className="form-field__label-row">
              <label htmlFor="weekly-grade-name">Série/Turma</label>
              <span>Obrigatório</span>
            </div>
            <input
              id="weekly-grade-name"
              name="gradeName"
              type="text"
              value={value.gradeName}
              onChange={handleGlobalFieldChange}
              placeholder="Ex.: 1º Ano A"
              required
            />
          </div>

          <div className="form-field">
            <div className="form-field__label-row">
              <label htmlFor="weekly-periods-per-day">Tempos por dia</label>
              <span>1 a 8</span>
            </div>
            <input
              id="weekly-periods-per-day"
              name="periodsPerDay"
              type="number"
              min={MIN_PERIODS_PER_DAY}
              max={MAX_PERIODS_PER_DAY}
              value={value.periodsPerDay}
              onChange={handlePeriodsPerDayChange}
            />
          </div>
        </div>
      </div>

      {value.days.length > 0 ? (
        <div className="weekly-plan-days">
          {value.days.map((day) => (
            <WeeklyLessonDayBlock
              day={day}
              key={day.id}
              onDayChange={handleDayChange}
              onMomentChange={handleMomentChange}
            />
          ))}
        </div>
      ) : (
        <div className="activity-empty-state">
          <span className="activity-empty-state__icon">+</span>
          <h3>Nenhum dia selecionado ainda.</h3>
          <p>
            Selecione o intervalo no calendário para criar os blocos do plano
            semanal.
          </p>
        </div>
      )}
    </div>
  )
}

type WeeklyLessonDayBlockProps = {
  day: WeeklyLessonDay
  onDayChange: (
    dayId: string,
    changes: Partial<Pick<WeeklyLessonDay, 'theme' | 'objective'>>,
  ) => void
  onMomentChange: (
    dayId: string,
    momentId: string,
    changes: Partial<
      Pick<WeeklyLessonMoment, 'content' | 'classExercises' | 'skills'>
    >,
  ) => void
}

function WeeklyLessonDayBlock({
  day,
  onDayChange,
  onMomentChange,
}: WeeklyLessonDayBlockProps) {
  return (
    <section className="weekly-day-card" aria-labelledby={`${day.id}-title`}>
      <h3 id={`${day.id}-title`}>Dia {formatDatePtBr(day.date)}</h3>

      <div className="weekly-day-card__fields">
        <div className="form-field">
          <div className="form-field__label-row">
            <label htmlFor={`${day.id}-theme`}>Tema</label>
            <span>Obrigatório</span>
          </div>
          <input
            id={`${day.id}-theme`}
            type="text"
            value={day.theme}
            onChange={(event) =>
              onDayChange(day.id, { theme: event.target.value })
            }
            placeholder="Ex.: Identidade e família"
            required
          />
        </div>

        <div className="form-field">
          <div className="form-field__label-row">
            <label htmlFor={`${day.id}-objective`}>Objetivo</label>
            <span>Obrigatório</span>
          </div>
          <textarea
            id={`${day.id}-objective`}
            value={day.objective}
            onChange={(event) =>
              onDayChange(day.id, { objective: event.target.value })
            }
            placeholder="Descreva o objetivo principal do dia"
            required
          />
        </div>
      </div>

      <div className="weekly-moments">
        {day.moments.map((moment) => (
          <WeeklyLessonMomentFields
            dayId={day.id}
            moment={moment}
            key={moment.id}
            onChange={onMomentChange}
          />
        ))}
      </div>
    </section>
  )
}

type WeeklyLessonMomentFieldsProps = {
  dayId: string
  moment: WeeklyLessonMoment
  onChange: (
    dayId: string,
    momentId: string,
    changes: Partial<
      Pick<WeeklyLessonMoment, 'content' | 'classExercises' | 'skills'>
    >,
  ) => void
}

function WeeklyLessonMomentFields({
  dayId,
  moment,
  onChange,
}: WeeklyLessonMomentFieldsProps) {
  const fieldPrefix = `${dayId}-${moment.id}`

  return (
    <section className="weekly-moment-card">
      <h4>{moment.periodNumber}º tempo</h4>

      <div className="form-field">
        <div className="form-field__label-row">
          <label htmlFor={`${fieldPrefix}-content`}>Conteúdo</label>
          <span>Obrigatório</span>
        </div>
        <textarea
          id={`${fieldPrefix}-content`}
          value={moment.content}
          onChange={(event) =>
            onChange(dayId, moment.id, { content: event.target.value })
          }
          placeholder="Conteúdo trabalhado neste tempo"
          required
        />
      </div>

      <div className="form-field">
        <div className="form-field__label-row">
          <label htmlFor={`${fieldPrefix}-class-exercises`}>
            Exercícios em classe
          </label>
          <span>Obrigatório</span>
        </div>
        <textarea
          id={`${fieldPrefix}-class-exercises`}
          value={moment.classExercises}
          onChange={(event) =>
            onChange(dayId, moment.id, {
              classExercises: event.target.value,
            })
          }
          placeholder="Atividades realizadas em sala"
          required
        />
      </div>

      <div className="form-field">
        <div className="form-field__label-row">
          <label htmlFor={`${fieldPrefix}-skills`}>
            Habilidades-(Campos de experiência)
          </label>
          <span>Obrigatório</span>
        </div>
        <textarea
          id={`${fieldPrefix}-skills`}
          value={moment.skills}
          onChange={(event) =>
            onChange(dayId, moment.id, { skills: event.target.value })
          }
          placeholder="Habilidades ou campos de experiência"
          required
        />
      </div>
    </section>
  )
}

function createWeeklyLessonMomentsForDay(
  day: WeeklyLessonDay,
  periodsPerDay: number,
): WeeklyLessonMoment[] {
  const momentsByPeriod = new Map(
    day.moments.map((moment) => [moment.periodNumber, moment]),
  )

  return Array.from({ length: periodsPerDay }, (_, index) => {
    const periodNumber = index + 1
    const currentMoment = momentsByPeriod.get(periodNumber)

    return {
      id: `period-${periodNumber}`,
      periodNumber,
      content: currentMoment?.content ?? '',
      classExercises: currentMoment?.classExercises ?? '',
      skills: currentMoment?.skills ?? '',
    }
  })
}

function dateValueToDate(dateValue: DateValue): Date {
  return new Date(dateValue.year, dateValue.month - 1, dateValue.day)
}

function formatDateForDatePicker(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}
