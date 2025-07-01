export type Message = {
    _id: string,
  senderId: {
    _id: string,
    name: string,
  },
  receiverId: {
    _id: string,
    name: string,
  }
  message: string,
  isRead: boolean,
  createdAt: string,
}
