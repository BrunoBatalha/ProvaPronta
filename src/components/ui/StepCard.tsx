import type { ReactNode } from 'react'

type StepCardProps = {
  number: number
  title: string
  description: string
  children: ReactNode
}

export function StepCard({
  number,
  title,
  description,
  children,
}: StepCardProps) {
  const titleId = `step-${number}-title`

  return (
    <section className="step-card" aria-labelledby={titleId}>
      <div className="step-card__heading">
        <span className="step-card__number" aria-hidden="true">
          {number}
        </span>
        <div>
          <span className="step-card__eyebrow">Etapa {number}</span>
          <h2 id={titleId}>{title}</h2>
          <p>{description}</p>
        </div>
      </div>
      <div className="step-card__content">{children}</div>
    </section>
  )
}
