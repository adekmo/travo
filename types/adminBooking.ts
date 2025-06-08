export interface AdminBooking {
  _id: string
  customerId: {
    _id: string
    name: string
    email: string
  }
  packageId: {
    _id: string
    title: string
  }
  date: string
  status: "pending" | "confirmed" | "cancelled"
  numberOfPeople: number
  note?: string
}