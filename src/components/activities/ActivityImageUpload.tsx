import {
  lazy,
  Suspense,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type MouseEvent,
} from 'react'
import { validateActivityImage } from '../../lib/activityUtils'
import { createCroppedImageFile } from '../../lib/imageCropUtils'
import type { Activity, CropArea } from '../../types/document'

const ImageCropEditor = lazy(async () => {
  const module = await import('./ImageCropEditor')

  return { default: module.ImageCropEditor }
})

type ActivityImageUploadProps = {
  activity: Activity
  number: number
  onChange: (changes: Partial<Omit<Activity, 'id'>>) => void
}

type EditorSource = {
  file: File
  url: string
  isCommittedOriginal: boolean
}

export function ActivityImageUpload({
  activity,
  number,
  onChange,
}: ActivityImageUploadProps) {
  const [imageError, setImageError] = useState<string>()
  const [editorSource, setEditorSource] = useState<EditorSource>()
  const [isProcessing, setIsProcessing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const filePickerTriggerRef = useRef<HTMLButtonElement | null>(null)
  const pendingSourceUrlRef = useRef<string | undefined>(undefined)
  const imageId = `activity-${activity.id}-image`
  const imageErrorId = `${imageId}-error`

  useEffect(() => {
    return () => {
      if (pendingSourceUrlRef.current) {
        URL.revokeObjectURL(pendingSourceUrlRef.current)
      }
    }
  }, [])

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (!file) {
      return
    }

    const error = validateActivityImage(file)

    if (error) {
      setImageError(error)
      return
    }

    const sourceUrl = URL.createObjectURL(file)
    pendingSourceUrlRef.current = sourceUrl
    filePickerTriggerRef.current?.focus()
    setImageError(undefined)
    setEditorSource({
      file,
      url: sourceUrl,
      isCommittedOriginal: false,
    })
  }

  function handleEditCrop() {
    if (!activity.originalImage || !activity.originalImageUrl) {
      return
    }

    setImageError(undefined)
    setEditorSource({
      file: activity.originalImage,
      url: activity.originalImageUrl,
      isCommittedOriginal: true,
    })
  }

  function handleOpenFilePicker(event: MouseEvent<HTMLButtonElement>) {
    filePickerTriggerRef.current = event.currentTarget
    inputRef.current?.click()
  }

  function handleCancelEditor() {
    if (editorSource && !editorSource.isCommittedOriginal) {
      URL.revokeObjectURL(editorSource.url)
      pendingSourceUrlRef.current = undefined
    }

    setEditorSource(undefined)
  }

  async function handleConfirmCrop(
    cropPixels: CropArea,
    cropPercentages: CropArea,
    cropAspect: number,
  ) {
    if (!editorSource) {
      return
    }

    setIsProcessing(true)
    setImageError(undefined)

    try {
      const croppedImage = await createCroppedImageFile(
        editorSource.url,
        editorSource.file,
        cropPixels,
      )
      const croppedPreviewUrl = URL.createObjectURL(croppedImage)

      if (
        activity.originalImageUrl &&
        activity.originalImageUrl !== editorSource.url
      ) {
        URL.revokeObjectURL(activity.originalImageUrl)
      }

      if (activity.imagePreviewUrl) {
        URL.revokeObjectURL(activity.imagePreviewUrl)
      }

      onChange({
        image: croppedImage,
        originalImage: editorSource.file,
        originalImageUrl: editorSource.url,
        imagePreviewUrl: croppedPreviewUrl,
        cropArea: cropPercentages,
        cropAspect,
      })
      pendingSourceUrlRef.current = undefined
      setEditorSource(undefined)
    } catch (error) {
      setImageError(
        error instanceof Error
          ? error.message
          : 'Não foi possível preparar o recorte da imagem.',
      )
    } finally {
      setIsProcessing(false)
    }
  }

  function handleRemoveImage() {
    if (activity.originalImageUrl) {
      URL.revokeObjectURL(activity.originalImageUrl)
    }

    if (activity.imagePreviewUrl) {
      URL.revokeObjectURL(activity.imagePreviewUrl)
    }

    setImageError(undefined)
    onChange({
      image: undefined,
      originalImage: undefined,
      originalImageUrl: undefined,
      imagePreviewUrl: undefined,
      cropArea: undefined,
      cropAspect: undefined,
    })
  }

  return (
    <div className="form-field">
      <div className="form-field__label-row">
        <label htmlFor={imageId}>Imagem da atividade</label>
        <span>Obrigatório</span>
      </div>

      <input
        ref={inputRef}
        id={imageId}
        className="activity-image-upload__input"
        name={`activities.${activity.id}.image`}
        type="file"
        accept=".png,.jpg,.jpeg,image/png,image/jpeg"
        onChange={handleImageChange}
        aria-describedby={imageError ? imageErrorId : `${imageId}-help`}
        aria-invalid={imageError ? true : undefined}
      />

      {activity.imagePreviewUrl ? (
        <div className="activity-image-upload">
          <img
            className="activity-image-upload__preview"
            src={activity.imagePreviewUrl}
            alt={`Recorte da imagem da atividade ${number}`}
          />
          <div className="activity-image-upload__actions">
            <button
              className="secondary-button"
              type="button"
              onClick={handleEditCrop}
            >
              Editar recorte
            </button>
            <button
              className="secondary-button"
              type="button"
              onClick={handleOpenFilePicker}
            >
              Trocar imagem
            </button>
            <button
              className="danger-button"
              type="button"
              onClick={handleRemoveImage}
            >
              Remover imagem
            </button>
          </div>
        </div>
      ) : (
        <button
          className="activity-image-upload__select"
          type="button"
          onClick={handleOpenFilePicker}
        >
          <strong>Selecionar imagem</strong>
          <span>PNG, JPG ou JPEG de até 5 MB</span>
        </button>
      )}

      <p id={`${imageId}-help`} className="form-field__help">
        Depois de selecionar, ajuste o recorte antes de usar a imagem.
      </p>
      {imageError ? (
        <p id={imageErrorId} className="form-field__error" role="alert">
          {imageError}
        </p>
      ) : null}

      {editorSource ? (
        <Suspense
          fallback={
            <div className="crop-modal" role="status">
              <div className="crop-modal__loading">Carregando editor...</div>
            </div>
          }
        >
          <ImageCropEditor
            imageUrl={editorSource.url}
            initialCropArea={
              editorSource.isCommittedOriginal ? activity.cropArea : undefined
            }
            initialAspect={
              editorSource.isCommittedOriginal ? activity.cropAspect : undefined
            }
            isProcessing={isProcessing}
            onCancel={handleCancelEditor}
            onConfirm={handleConfirmCrop}
          />
        </Suspense>
      ) : null}
    </div>
  )
}
