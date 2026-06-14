import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { validateHeaderImage } from '../../lib/headerImageUtils'
import type { SchoolInfo } from '../../types/document'

type SchoolInfoFormProps = {
  value: SchoolInfo
  onChange: (value: SchoolInfo) => void
}

export function SchoolInfoForm({
  value,
  onChange,
}: SchoolInfoFormProps) {
  const [headerImageError, setHeaderImageError] = useState<string>()
  const headerImageInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    return () => {
      if (value.headerImagePreviewUrl && value.headerImagePreviewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(value.headerImagePreviewUrl)
      }
    }
  }, [value.headerImagePreviewUrl])

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const field = event.target.name as Exclude<
      keyof SchoolInfo,
      'headerImage' | 'headerImagePreviewUrl'
    >

    onChange({
      ...value,
      [field]: event.target.value,
    })
  }

  function handleHeaderImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    const error = validateHeaderImage(file)

    if (error) {
      event.target.value = ''
      setHeaderImageError(error)
      return
    }

    setHeaderImageError(undefined)
    onChange({
      ...value,
      headerImage: file,
      headerImagePreviewUrl: URL.createObjectURL(file),
    })
  }

  function handleRemoveHeaderImage() {
    if (headerImageInputRef.current) {
      headerImageInputRef.current.value = ''
    }

    setHeaderImageError(undefined)
    onChange({
      ...value,
      headerImage: undefined,
      headerImagePreviewUrl: undefined,
    })
  }

  return (
    <div className="school-form">
      <div className="form-field form-field--wide">
        <div className="form-field__label-row">
          <label htmlFor="header-image">Cabeçalho do documento</label>
          <span>Opcional</span>
        </div>

        {value.headerImagePreviewUrl ? (
          <div className="header-image-upload__preview">
            <img
              src={value.headerImagePreviewUrl}
              alt="Prévia do cabeçalho do documento"
            />
          </div>
        ) : (
          <div className="header-image-upload__empty" aria-hidden="true">
            Cabeçalho horizontal
          </div>
        )}

        <input
          ref={headerImageInputRef}
          id="header-image"
          name="headerImage"
          type="file"
          accept=".png,.jpg,.jpeg,image/png,image/jpeg"
          onChange={handleHeaderImageChange}
          aria-describedby={
            headerImageError
              ? 'header-image-help header-image-error'
              : 'header-image-help'
          }
          aria-invalid={headerImageError ? true : undefined}
        />
        <p id="header-image-help" className="form-field__help">
          Envie a faixa completa que ficará no topo do Word em PNG, JPG ou JPEG
          de até 2 MB.
        </p>
        {headerImageError ? (
          <p
            id="header-image-error"
            className="form-field__error"
            role="alert"
          >
            {headerImageError}
          </p>
        ) : null}

        {value.headerImage ? (
          <div className="header-image-upload__actions">
            <button
              className="secondary-button"
              type="button"
              onClick={() => headerImageInputRef.current?.click()}
            >
              Trocar cabeçalho
            </button>
            <button
              className="danger-button"
              type="button"
              onClick={handleRemoveHeaderImage}
            >
              Remover cabeçalho
            </button>
          </div>
        ) : null}
      </div>

      <div className="form-field form-field--wide">
        <div className="form-field__label-row">
          <label htmlFor="school-name">Nome da escola</label>
          <span>Obrigatório</span>
        </div>
        <input
          id="school-name"
          name="schoolName"
          type="text"
          value={value.schoolName}
          onChange={handleChange}
          placeholder="Ex.: Escola Caminhos do Saber"
          required
        />
      </div>

      <div className="form-field">
        <div className="form-field__label-row">
          <label htmlFor="director-name">Nome da diretora</label>
          <span>Opcional</span>
        </div>
        <input
          id="director-name"
          name="directorName"
          type="text"
          value={value.directorName}
          onChange={handleChange}
          placeholder="Ex.: Maria Silva"
        />
      </div>

      <div className="form-field">
        <div className="form-field__label-row">
          <label htmlFor="teacher-name">Nome da professora</label>
          <span>Obrigatório</span>
        </div>
        <input
          id="teacher-name"
          name="teacherName"
          type="text"
          value={value.teacherName}
          onChange={handleChange}
          placeholder="Ex.: Ana Souza"
          required
        />
      </div>
    </div>
  )
}
