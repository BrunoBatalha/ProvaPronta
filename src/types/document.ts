export type SchoolInfo = {
  schoolName: string
  directorName: string
  teacherName: string
  gradeName: string
  headerImage?: File
  headerImagePreviewUrl?: string
}

export type Activity = {
  id: string
  statement: string
  image?: File
}
