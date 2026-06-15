import type { Activity } from '../../types/document'

type DocumentPreviewProps = {
  headerImagePreviewUrl?: string
  activities: Activity[]
}

export function DocumentPreview({
  headerImagePreviewUrl,
  activities,
}: DocumentPreviewProps) {
  return (
    <div className="preview-card">
      <div className="preview-card__header">
        <h2>Prévia do documento</h2>
        <p>Confira a ordem das informações antes de gerar.</p>
      </div>

      <div className="preview-card__paper" aria-label="Exemplo de documento">
        <div className="preview-document">
          {headerImagePreviewUrl ? (
            <img
              className="preview-document__header-image"
              src={headerImagePreviewUrl}
              alt="Cabeçalho do documento"
            />
          ) : (
            <div className="preview-document__header-placeholder">
              Cabeçalho opcional
            </div>
          )}
          <div className="preview-document__header-block">
            <p className="preview-document__header-row">
              ESCOLA CAMINHOS DO SABER
            </p>
            <p className="preview-document__header-row">
              <strong>DIRETORA:</strong> MARIA SILVA
            </p>
            <p className="preview-document__header-row">
              <strong>PROFESSORA:</strong> ANA SOUZA
            </p>
            <p className="preview-document__header-row">
              <strong>ALUNO(A):</strong> ___________________________
            </p>
            <div className="preview-document__header-row preview-document__header-row--grade">
              <span>
                <strong>SÉRIE:</strong> 1º ANO A
              </span>
              <span>
                <strong>DATA:</strong> __ / __ / ____
              </span>
            </div>
          </div>

          <p className="preview-document__title">Atividades</p>
          {activities.length > 0 ? (
            <div className="preview-document__activities">
              {activities.map((activity, index) => (
                <div
                  className="preview-document__activity"
                  key={activity.id}
                >
                  <p className="preview-document__statement">
                    <strong>{index + 1}.</strong>{' '}
                    {activity.statement.trim() || 'Enunciado da atividade'}
                  </p>
                  {activity.imagePreviewUrl ? (
                    <img
                      className="preview-document__activity-image"
                      src={activity.imagePreviewUrl}
                      alt={`Imagem da atividade ${index + 1}`}
                    />
                  ) : (
                    <div className="preview-document__image">
                      Imagem da atividade
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <>
              <p className="preview-document__statement">
                <strong>1.</strong> O enunciado aparecerá aqui.
              </p>
              <div className="preview-document__image">
                Imagem da atividade
              </div>
            </>
          )}
        </div>
      </div>

      <p className="preview-card__note">
        Esta é uma representação simples. O arquivo final continuará editável
        no Word.
      </p>
    </div>
  )
}
