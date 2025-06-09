export interface Review {
  _id: string
  rating: number
  comment?: string
  customer: {
    name: string
  }
  createdAt: string
}