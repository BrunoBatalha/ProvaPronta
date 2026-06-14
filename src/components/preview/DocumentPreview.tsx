type DocumentPreviewProps = {
  headerImagePreviewUrl?: string
}

export function DocumentPreview({
  headerImagePreviewUrl,
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
          <h3>Escola Caminhos do Saber</h3>
          <p className="preview-document__meta">
            Diretora: Maria Silva
            <br />
            Professora: Ana Souza
            <br />
            Aluno: ____________________
            <br />
            Turma: 1º Ano A · Data: 14/06/2026
          </p>

          <p className="preview-document__title">Atividade de Matemática</p>
          <p className="preview-document__statement">
            <strong>1.</strong> Pinte as figuras que têm a forma de um círculo.
          </p>
          <div className="preview-document__image">Imagem da atividade</div>
        </div>
      </div>

      <p className="preview-card__note">
        Esta é uma representação simples. O arquivo final continuará editável
        no Word.
      </p>
    </div>
  )
}
