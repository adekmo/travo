export type Category = {
    _id: string
  name: string
  description?: string
  category: {
    _id: string
    name: string
  }
  createdAt: string
  updatedAt: string
}