export interface SellerBooking {
  _id: string
  packageId: {
    title: string
    location: string
    price: number
  }
  customerId: {
    name: string
    email: string
  }
  date: string
  numberOfPeople: number
  note?: string
  status: "pending" | "confirmed" | "cancelled"
}