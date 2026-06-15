import { useEffect, useRef, useState } from 'react'
import './App.css'
import { ActivityInfoForm } from './components/activity/ActivityInfoForm'
import { ActivityList } from './components/activities/ActivityList'
import { AppHeader } from './components/layout/AppHeader'
import { AppShell } from './components/layout/AppShell'
import { HeroSection } from './components/layout/HeroSection'
import { DocumentPreview } from './components/preview/DocumentPreview'
import { SchoolInfoForm } from './components/school/SchoolInfoForm'
import { StepCard } from './components/ui/StepCard'
import {
  createActivity,
  removeActivity,
  revokeActivityImageUrls,
  updateActivity,
} from './lib/activityUtils'
import {
  generateDocx,
  validateDocumentData,
} from './lib/generateDocx'
import type { Activity, SchoolInfo } from './types/document'
import defaultHeaderImage from './assets/header-ceph.png'

const searchParams = new URLSearchParams(window.location.search)
const useCephDefaults = searchParams.get('s') === 'ceph'

const initialSchoolInfo: SchoolInfo = {
  schoolName: useCephDefaults ? 'CENTRO EDUCACIONAL PARQUE DAS HORTÊNSIAS' : '',
  directorName: useCephDefaults ? 'MARIA VILANE BESSA SEGUNDO' : '',
  teacherName: useCephDefaults ? 'INGRID LIMA SOARES' : '',
  activityTitle: '',
  gradeName: '',
  headerImage: undefined,
  headerImagePreviewUrl: useCephDefaults ? defaultHeaderImage : undefined,
}

type GenerationStatus = 'idle' | 'generating' | 'success' | 'error'

function App() {
  const [schoolInfo, setSchoolInfo] = useState(initialSchoolInfo)
  const [activities, setActivities] = useState<Activity[]>([])
  const activitiesRef = useRef(activities)
  const [generationStatus, setGenerationStatus] =
    useState<GenerationStatus>('idle')
  const [generationErrors, setGenerationErrors] = useState<string[]>([])

  useEffect(() => {
    if (!useCephDefaults) return

    fetch(defaultHeaderImage)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], 'header-ceph.png', { type: 'image/png' })
        const previewUrl = URL.createObjectURL(file)
        setSchoolInfo((prev) => {
          if (prev.headerImagePreviewUrl === defaultHeaderImage) {
            return {
              ...prev,
              headerImage: file,
              headerImagePreviewUrl: previewUrl,
            }
          }
          URL.revokeObjectURL(previewUrl)
          return prev
        })
      })
      .catch((err) => {
        console.error('Erro ao carregar imagem padrão de cabeçalho:', err)
      })
  }, [])

  useEffect(() => {
    activitiesRef.current = activities
  }, [activities])

  useEffect(() => {
    return () => {
      activitiesRef.current.forEach(revokeActivityImageUrls)
    }
  }, [])

  function handleAddActivity() {
    setActivities((currentActivities) => [
      ...currentActivities,
      createActivity(() => crypto.randomUUID()),
    ])
  }

  function handleActivityChange(
    activityId: string,
    changes: Partial<Omit<Activity, 'id'>>,
  ) {
    setActivities((currentActivities) =>
      updateActivity(currentActivities, activityId, changes),
    )
  }

  function handleRemoveActivity(activityId: string) {
    setActivities((currentActivities) => {
      const activityToRemove = currentActivities.find(
        (activity) => activity.id === activityId,
      )

      if (activityToRemove) {
        revokeActivityImageUrls(activityToRemove)
      }

      return removeActivity(currentActivities, activityId)
    })
  }

  async function handleGenerateDocument() {
    const validationErrors = validateDocumentData(schoolInfo, activities)

    if (validationErrors.length > 0) {
      setGenerationErrors(validationErrors)
      setGenerationStatus('error')
      return
    }

    setGenerationErrors([])
    setGenerationStatus('generating')

    try {
      const documentBlob = await generateDocx(schoolInfo, activities)
      const downloadUrl = URL.createObjectURL(documentBlob)
      const downloadLink = document.createElement('a')

      downloadLink.href = downloadUrl
      downloadLink.download = 'prova-pronta.docx'
      document.body.appendChild(downloadLink)
      downloadLink.click()
      downloadLink.remove()
      URL.revokeObjectURL(downloadUrl)

      setGenerationStatus('success')
    } catch {
      setGenerationErrors([
        'Não foi possível gerar o documento. Verifique as imagens e tente novamente.',
      ])
      setGenerationStatus('error')
    }
  }

  return (
    <AppShell>
      <AppHeader />
      <HeroSection />

      <main id="montar-atividade" className="workspace" tabIndex={-1}>
        <div className="workspace__steps" aria-label="Etapas de preenchimento">
          <StepCard
            number={1}
            title="Dados da escola"
            description="Adicione a identidade da escola e as informações de quem preparou a atividade."
          >
            <SchoolInfoForm value={schoolInfo} onChange={setSchoolInfo} />
          </StepCard>

          <StepCard
            number={2}
            title="Dados da atividade"
            description="Organize as informações que aparecerão no cabeçalho do documento."
          >
            <ActivityInfoForm
              activityTitle={schoolInfo.activityTitle}
              onActivityTitleChange={(activityTitle) => {
                setSchoolInfo((currentSchoolInfo) => ({
                  ...currentSchoolInfo,
                  activityTitle,
                }))
              }}
              gradeName={schoolInfo.gradeName}
              onGradeNameChange={(gradeName) => {
                setSchoolInfo((currentSchoolInfo) => ({
                  ...currentSchoolInfo,
                  gradeName,
                }))
              }}
            />
          </StepCard>

          <StepCard
            number={3}
            title="Atividades"
            description="Cada atividade terá um enunciado e uma imagem logo abaixo."
          >
            <ActivityList
              activities={activities}
              onAdd={handleAddActivity}
              onChange={handleActivityChange}
              onRemove={handleRemoveActivity}
            />
          </StepCard>
        </div>

        <aside className="workspace__preview" aria-label="Prévia do documento">
          <DocumentPreview
            headerImagePreviewUrl={schoolInfo.headerImagePreviewUrl}
            activityTitle={schoolInfo.activityTitle}
            activities={activities}
          />
        </aside>

        <section className="workspace__generate" aria-labelledby="generate-title">
          <div className="generate-card">
            <div>
              <span className="step-card__eyebrow">Etapa 4</span>
              <h2 id="generate-title">Gerar documento</h2>
              <p>
                Revise a prévia e baixe um arquivo editável para abrir no Word
                ou LibreOffice.
              </p>
            </div>
            <button
              className="primary-button primary-button--full"
              type="button"
              onClick={handleGenerateDocument}
              disabled={generationStatus === 'generating'}
            >
              {generationStatus === 'generating'
                ? 'Gerando seu documento...'
                : 'Gerar documento Word'}
            </button>
            {generationStatus === 'error' ? (
              <div
                className="generate-card__feedback generate-card__feedback--error"
                role="alert"
              >
                <strong>Revise antes de gerar:</strong>
                <ul>
                  {generationErrors.map((error) => (
                    <li key={error}>{error}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            {generationStatus === 'success' ? (
              <p
                className="generate-card__feedback generate-card__feedback--success"
                role="status"
              >
                Documento criado com sucesso. O arquivo foi baixado e pode ser
                editado no Word.
              </p>
            ) : null}
            <p className="generate-card__note">
              O arquivo final será editável no Word ou LibreOffice.
            </p>
          </div>
        </section>
      </main>
    </AppShell>
  )
}

export default App
