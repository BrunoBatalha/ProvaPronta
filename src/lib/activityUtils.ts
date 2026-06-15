import type { Activity } from '../types/document.js'

const MAX_ACTIVITY_IMAGE_SIZE = 5 * 1024 * 1024
const ACCEPTED_ACTIVITY_IMAGE_TYPES = new Set(['image/jpeg', 'image/png'])
const ACCEPTED_ACTIVITY_IMAGE_EXTENSIONS = /\.(jpe?g|png)$/i

type ActivityIdFactory = () => string

export function createActivity(createId: ActivityIdFactory): Activity {
  return {
    id: createId(),
    statement: '',
    image: undefined,
    originalImage: undefined,
    originalImageUrl: undefined,
    imagePreviewUrl: undefined,
    cropArea: undefined,
    cropAspect: undefined,
  }
}

export function updateActivity(
  activities: Activity[],
  activityId: string,
  changes: Partial<Omit<Activity, 'id'>>,
): Activity[] {
  return activities.map((activity) =>
    activity.id === activityId
      ? { ...activity, ...changes }
      : activity,
  )
}

export function removeActivity(
  activities: Activity[],
  activityId: string,
): Activity[] {
  return activities.filter((activity) => activity.id !== activityId)
}

export function revokeActivityImageUrls(activity: Activity): void {
  if (activity.originalImageUrl) {
    URL.revokeObjectURL(activity.originalImageUrl)
  }

  if (activity.imagePreviewUrl) {
    URL.revokeObjectURL(activity.imagePreviewUrl)
  }
}

export function validateActivityImage(file: File): string | undefined {
  const hasAcceptedType = ACCEPTED_ACTIVITY_IMAGE_TYPES.has(file.type)
  const hasAcceptedFallbackExtension =
    file.type === '' && ACCEPTED_ACTIVITY_IMAGE_EXTENSIONS.test(file.name)

  if (!hasAcceptedType && !hasAcceptedFallbackExtension) {
    return 'Use uma imagem em PNG, JPG ou JPEG.'
  }

  if (file.size > MAX_ACTIVITY_IMAGE_SIZE) {
    return 'Essa imagem é muito grande. Envie uma imagem de até 5 MB.'
  }

  return undefined
}
