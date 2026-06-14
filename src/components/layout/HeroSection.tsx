const steps = [
  {
    number: 1,
    title: 'Preencha os dados',
    description: 'Informe escola, professora e turma.',
  },
  {
    number: 2,
    title: 'Adicione as atividades',
    description: 'Escreva enunciados e envie imagens.',
  },
  {
    number: 3,
    title: 'Baixe em Word',
    description: 'Receba um arquivo editável.',
  },
]

export function HeroSection() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__content">
        <div className="hero__copy">
          <h1 id="hero-title">
            Crie atividades escolares em Word em poucos minutos
          </h1>
          <p>
            Preencha os dados, adicione imagens das atividades e baixe um
            arquivo .docx editável.
          </p>
          <a className="primary-button" href="#montar-atividade">
            Começar agora
          </a>
        </div>

        <div className="hero__steps" aria-label="Como funciona">
          {steps.map((step) => (
            <div className="hero-step" key={step.number}>
              <span className="hero-step__number" aria-hidden="true">
                {step.number}
              </span>
              <div>
                <strong>{step.title}</strong>
                <span>{step.description}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
