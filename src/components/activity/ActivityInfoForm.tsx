import type { ChangeEvent } from 'react'

type ActivityInfoFormProps = {
  activityTitle: string
  onActivityTitleChange: (activityTitle: string) => void
  gradeName: string
  onGradeNameChange: (gradeName: string) => void
}

export function ActivityInfoForm({
  activityTitle,
  onActivityTitleChange,
  gradeName,
  onGradeNameChange,
}: ActivityInfoFormProps) {
  function handleActivityTitleChange(event: ChangeEvent<HTMLInputElement>) {
    onActivityTitleChange(event.target.value)
  }

  function handleGradeNameChange(event: ChangeEvent<HTMLInputElement>) {
    onGradeNameChange(event.target.value)
  }

  return (
    <div className="activity-form">
      <div className="form-field">
        <div className="form-field__label-row">
          <label htmlFor="activity-title">Título da atividade</label>
          <span>Opcional</span>
        </div>
        <input
          id="activity-title"
          name="activityTitle"
          type="text"
          value={activityTitle}
          onChange={handleActivityTitleChange}
          placeholder="Ex.: Avaliação de matemática"
        />
      </div>

      <div className="form-field">
        <div className="form-field__label-row">
          <label htmlFor="grade-name">Série</label>
          <span>Opcional</span>
        </div>
        <input
          id="grade-name"
          name="gradeName"
          type="text"
          value={gradeName}
          onChange={handleGradeNameChange}
          placeholder="Ex.: 1º Ano A"
        />
      </div>
    </div>
  )
}
