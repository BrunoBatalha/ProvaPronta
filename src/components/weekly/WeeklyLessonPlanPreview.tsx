import type { WeeklyLessonPlan } from '../../types/document'
import { formatDatePtBr } from '../../lib/weeklyLessonPlanUtils'

type WeeklyLessonPlanPreviewProps = {
  plan: WeeklyLessonPlan
}

export function WeeklyLessonPlanPreview({
  plan,
}: WeeklyLessonPlanPreviewProps) {
  return (
    <div className="preview-card">
      <div className="preview-card__header">
        <h2>Prévia do plano semanal</h2>
        <p>Confira a ordem dos dias e tempos antes de gerar.</p>
      </div>

      <div className="preview-card__paper" aria-label="Exemplo de plano semanal">
        <div className="preview-document preview-document--weekly">
          {plan.days.length > 0 ? (
            plan.days.map((day) => (
              <section className="preview-weekly-day" key={day.id}>
                <h3>DIA {formatDatePtBr(day.date)}</h3>
                <p>
                  <strong>1º MOMENTO</strong>
                </p>
                <p>
                  <strong>TEMA:</strong>{' '}
                  {day.theme.trim() || 'Tema do dia'}
                </p>
                <p>
                  <strong>OBJETIVO:</strong>{' '}
                  {day.objective.trim() || 'Objetivo do dia'}
                </p>
                <p className="preview-weekly-day__row">
                  <span>
                    <strong>PROFESSORA:</strong>{' '}
                    {plan.teacherName.trim() || 'Nome da professora'}
                  </span>
                  <span>
                    <strong>SÉRIE/TURMA:</strong>{' '}
                    {plan.gradeName.trim() || 'Turma'}
                  </span>
                </p>

                {day.moments.map((moment) => (
                  <div className="preview-weekly-moment" key={moment.id}>
                    <p>
                      <strong>{moment.periodNumber}ºTEMPO:</strong>
                    </p>
                    <p>
                      <strong>CONTEÚDO:</strong>{' '}
                      {moment.content.trim() || 'Conteúdo'}
                    </p>
                    <p>
                      <strong>EXERCÍCIOS EM CLASSE:</strong>{' '}
                      {moment.classExercises.trim() || 'Exercícios'}
                    </p>
                    <p>
                      <strong>HABILIDADES-(CAMPOS DE EXPERIÊNCIA):</strong>{' '}
                      {moment.skills.trim() || 'Habilidades'}
                    </p>
                    <p className="preview-weekly-moment__resources">
                      RECURSOS: BIBLIOTECA( ) SALA DE VÍDEO( ) PLAYGROUND( )
                      QUADRA( ) OUTROS:SALA DE AULA
                    </p>
                  </div>
                ))}
              </section>
            ))
          ) : (
            <div className="preview-weekly-empty">
              Selecione um intervalo para visualizar o plano semanal.
            </div>
          )}
        </div>
      </div>

      <p className="preview-card__note">
        A prévia é resumida. O arquivo final continuará editável no Word.
      </p>
    </div>
  )
}
