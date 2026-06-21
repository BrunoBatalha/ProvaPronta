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

export type WeeklyLessonPlan = {
  startDate?: Date
  endDate?: Date
  teacherName: string
  gradeName: string
  periodsPerDay: number
  days: WeeklyLessonDay[]
}

export type WeeklyLessonDay = {
  id: string
  date: Date
  theme: string
  objective: string
  moments: WeeklyLessonMoment[]
}

export type WeeklyLessonMoment = {
  id: string
  periodNumber: number
  content: string
  classExercises: string
  skills: string
}
