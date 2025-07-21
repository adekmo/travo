export interface Story {
  _id: string
  title: string
  content: string
  createdAt: string
  packageId?: {
    title: string
    _id: string
  }
  userId?: {
    name: string
    image?: string
  }
  media?: string[]
}