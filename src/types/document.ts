export type SchoolInfo = {
  schoolName: string
  directorName: string
  teacherName: string
  activityTitle: string
  gradeName: string
  headerImage?: File
  headerImagePreviewUrl?: string
}

export type Activity = {
  id: string
  statement: string
  image?: File
  originalImage?: File
  originalImageUrl?: string
  imagePreviewUrl?: string
  cropArea?: CropArea
  cropAspect?: number
}

export type CropArea = {
  x: number
  y: number
  width: number
  height: number
}
