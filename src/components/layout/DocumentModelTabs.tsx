type DocumentModelTabsProps = {
  activeModel: 'first' | 'second'
  firstLabel: string
  secondLabel: string
  onChange: (model: 'first' | 'second') => void
}

export function DocumentModelTabs({
  activeModel,
  firstLabel,
  secondLabel,
  onChange,
}: DocumentModelTabsProps) {
  const tabs = [
    { id: 'first' as const, label: firstLabel },
    { id: 'second' as const, label: secondLabel },
  ]

  return (
    <nav className="model-tabs" aria-label="Modelos de arquivo">
      <div className="model-tabs__content" role="tablist">
        {tabs.map((tab) => (
          <button
            className={
              activeModel === tab.id
                ? 'model-tabs__tab model-tabs__tab--active'
                : 'model-tabs__tab'
            }
            type="button"
            role="tab"
            aria-selected={activeModel === tab.id}
            aria-controls="montar-atividade"
            key={tab.id}
            onClick={() => onChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </nav>
  )
}
