import type { ChangeEvent } from 'react'
import type { Activity } from '../../types/document'
import { ActivityImageUpload } from './ActivityImageUpload'

type ActivityCardProps = {
  activity: Activity
  number: number
  onChange: (changes: Partial<Omit<Activity, 'id'>>) => void
  onRemove: () => void
}

export function ActivityCard({
  activity,
  number,
  onChange,
  onRemove,
}: ActivityCardProps) {
  const statementId = `activity-${activity.id}-statement`

  function handleStatementChange(event: ChangeEvent<HTMLTextAreaElement>) {
    onChange({ statement: event.target.value })
  }

  return (
    <article className="activity-card" aria-labelledby={`${statementId}-title`}>
      <div className="activity-card__header">
        <h3 id={`${statementId}-title`}>Atividade {number}</h3>
        <button
          className="danger-button"
          type="button"
          onClick={onRemove}
          aria-label={`Remover atividade ${number}`}
        >
          Remover atividade
        </button>
      </div>

      <div className="form-field">
        <div className="form-field__label-row">
          <label htmlFor={statementId}>Enunciado</label>
          <span>Obrigatório</span>
        </div>
        <textarea
          id={statementId}
          name={`activities.${activity.id}.statement`}
          value={activity.statement}
          onChange={handleStatementChange}
          placeholder="Ex.: Pinte os desenhos que começam com a letra A."
          required
        />
      </div>

      <ActivityImageUpload
        activity={activity}
        number={number}
        onChange={onChange}
      />
    </article>
  )
}
