export function AppHeader() {
  return (
    <header className="app-header">
      <div className="app-header__content">
        <a className="brand" href="#" aria-label="ProvaPronta, início">
          <span className="brand__mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M7 3.75h7.5L19 8.25v12H7v-16.5Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
              <path
                d="M14.5 3.75v4.5H19M10 12h6M10 15.5h6"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          ProvaPronta
        </a>
        <p className="app-header__message">Atividades em Word, sem complicação.</p>
      </div>
    </header>
  )
}
