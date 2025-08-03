import { Types } from "mongoose"

export interface Story {
  _id: string
  title: string
  content: string
  tags: string[]
  createdAt: string
  packageId?: {
    title: string
    _id: string
    location: string
  }
  userId?: {
    name: string
    avatar?: string
  }
  media?: string[]
  likes: Types.ObjectId[]
  commentCount: number
  featured: boolean
}