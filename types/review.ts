export interface Review {
  _id: string
  rating: number
  comment?: string
  customer: {
    name: string
  }
  package: {
    title: string
  }
  hidden: boolean
  createdAt: string
}