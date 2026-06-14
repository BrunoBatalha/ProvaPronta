import type { Activity } from '../../types/document'
import { ActivityCard } from './ActivityCard'

type ActivityListProps = {
  activities: Activity[]
  onAdd: () => void
  onChange: (
    activityId: string,
    changes: Partial<Omit<Activity, 'id'>>,
  ) => void
  onRemove: (activityId: string) => void
}

export function ActivityList({
  activities,
  onAdd,
  onChange,
  onRemove,
}: ActivityListProps) {
  if (activities.length === 0) {
    return (
      <div className="activity-empty-state">
        <div className="activity-empty-state__icon" aria-hidden="true">
          +
        </div>
        <h3>Nenhuma atividade adicionada ainda</h3>
        <p>Comece adicionando o primeiro enunciado e uma imagem.</p>
        <button className="primary-button" type="button" onClick={onAdd}>
          Adicionar primeira atividade
        </button>
      </div>
    )
  }

  return (
    <div className="activity-list">
      <div className="activity-list__items">
        {activities.map((activity, index) => (
          <ActivityCard
            key={activity.id}
            activity={activity}
            number={index + 1}
            onChange={(changes) => onChange(activity.id, changes)}
            onRemove={() => onRemove(activity.id)}
          />
        ))}
      </div>

      <button className="secondary-button" type="button" onClick={onAdd}>
        Adicionar outra atividade
      </button>
      <p className="activity-list__note">
        As atividades serão numeradas automaticamente na ordem em que aparecem.
      </p>
    </div>
  )
}
