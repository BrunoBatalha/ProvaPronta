import { useState, type ChangeEvent } from 'react'
import { validateActivityImage } from '../../lib/activityUtils'
import type { Activity } from '../../types/document'

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
  const [imageError, setImageError] = useState<string>()
  const statementId = `activity-${activity.id}-statement`
  const imageId = `activity-${activity.id}-image`
  const imageErrorId = `${imageId}-error`

  function handleStatementChange(event: ChangeEvent<HTMLTextAreaElement>) {
    onChange({ statement: event.target.value })
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    if (!file) {
      setImageError(undefined)
      onChange({ image: undefined })
      return
    }

    const error = validateActivityImage(file)

    if (error) {
      event.target.value = ''
      setImageError(error)
      onChange({ image: undefined })
      return
    }

    setImageError(undefined)
    onChange({ image: file })
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

      <div className="form-field">
        <div className="form-field__label-row">
          <label htmlFor={imageId}>Imagem da atividade</label>
          <span>Obrigatório</span>
        </div>
        <input
          id={imageId}
          name={`activities.${activity.id}.image`}
          type="file"
          accept=".png,.jpg,.jpeg,image/png,image/jpeg"
          onChange={handleImageChange}
          aria-describedby={imageError ? imageErrorId : undefined}
          aria-invalid={imageError ? true : undefined}
          required
        />
        <p className="form-field__help">
          Envie uma imagem em PNG, JPG ou JPEG de até 5 MB.
        </p>
        {imageError ? (
          <p id={imageErrorId} className="form-field__error" role="alert">
            {imageError}
          </p>
        ) : null}
      </div>
    </article>
  )
}
