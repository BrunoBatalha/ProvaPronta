import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import Cropper, { type Area, type Point } from 'react-easy-crop'
import type { CropArea } from '../../types/document'

type ImageCropEditorProps = {
  imageUrl: string
  initialCropArea?: CropArea
  initialAspect?: number
  isProcessing: boolean
  onCancel: () => void
  onConfirm: (
    cropArea: CropArea,
    cropPercentages: CropArea,
    aspect: number,
  ) => void
}

export function ImageCropEditor({
  imageUrl,
  initialCropArea,
  initialAspect = 4 / 3,
  isProcessing,
  onCancel,
  onConfirm,
}: ImageCropEditorProps) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [aspect, setAspect] = useState(initialAspect)
  const [croppedPixels, setCroppedPixels] = useState<Area>()
  const [croppedPercentages, setCroppedPercentages] = useState<Area>()
  const dialogRef = useRef<HTMLDivElement>(null)
  const cancelButtonRef = useRef<HTMLButtonElement>(null)
  const returnFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    returnFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null
    document.body.style.overflow = 'hidden'
    cancelButtonRef.current?.focus()

    return () => {
      document.body.style.overflow = previousOverflow
      returnFocusRef.current?.focus()
    }
  }, [])

  function handleCropComplete(percentages: Area, pixels: Area) {
    setCroppedPercentages(percentages)
    setCroppedPixels(pixels)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape' && !isProcessing) {
      event.preventDefault()
      onCancel()
      return
    }

    if (event.key !== 'Tab' || !dialogRef.current) {
      return
    }

    const focusableElements = Array.from(
      dialogRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    )

    if (focusableElements.length === 0) {
      return
    }

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault()
      lastElement.focus()
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault()
      firstElement.focus()
    }
  }

  function handleConfirm() {
    if (!croppedPixels || !croppedPercentages) {
      return
    }

    onConfirm(croppedPixels, croppedPercentages, aspect)
  }

  return (
    <div
      className="crop-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="crop-modal-title"
      onKeyDown={handleKeyDown}
    >
      <div className="crop-modal__panel" ref={dialogRef}>
        <div className="crop-modal__header">
          <div>
            <h2 id="crop-modal-title">Ajustar imagem</h2>
            <p>Arraste a imagem e use o zoom para escolher o que aparecerá.</p>
          </div>
        </div>

        <div className="crop-modal__surface">
          <Cropper
            image={imageUrl}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            initialCroppedAreaPercentages={initialCropArea}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={handleCropComplete}
            showGrid
            objectFit="contain"
          />
        </div>

        <div className="crop-modal__controls">
          <label htmlFor="crop-zoom">Zoom da imagem</label>
          <input
            id="crop-zoom"
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={zoom}
            onChange={(event) => setZoom(Number(event.target.value))}
          />
          <label htmlFor="crop-aspect">Formato do recorte</label>
          <input
            id="crop-aspect"
            type="range"
            min={0.6}
            max={2}
            step={0.05}
            value={aspect}
            onChange={(event) => setAspect(Number(event.target.value))}
            aria-describedby="crop-aspect-help"
          />
          <p id="crop-aspect-help" className="crop-modal__help">
            Deslize para deixar o recorte mais alto ou mais largo.
          </p>
        </div>

        <div className="crop-modal__actions">
          <button
            ref={cancelButtonRef}
            className="secondary-button"
            type="button"
            onClick={onCancel}
            disabled={isProcessing}
          >
            Cancelar
          </button>
          <button
            className="primary-button"
            type="button"
            onClick={handleConfirm}
            disabled={!croppedPixels || isProcessing}
          >
            {isProcessing ? 'Preparando imagem...' : 'Usar este recorte'}
          </button>
        </div>
      </div>
    </div>
  )
}
