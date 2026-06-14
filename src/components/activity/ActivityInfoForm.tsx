import type { ChangeEvent } from 'react'

type ActivityInfoFormProps = {
  gradeName: string
  onGradeNameChange: (gradeName: string) => void
}

export function ActivityInfoForm({
  gradeName,
  onGradeNameChange,
}: ActivityInfoFormProps) {
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onGradeNameChange(event.target.value)
  }

  return (
    <div className="activity-form">
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
          onChange={handleChange}
          placeholder="Ex.: 1º Ano A"
        />
      </div>
    </div>
  )
}
