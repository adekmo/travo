export interface AdminNotification {
  _id: string
  message: string
  type: 'new_seller' | 'updated_package'
  sellerId?: string
  packageId?: string
  isRead: boolean
  createdAt: string
}
