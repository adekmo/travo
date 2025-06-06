export interface Booking  {
    _id: string
    packageId: {
        title: string
        location: string
        price: number
    }
    date: string
    status: "pending" | "confirmed" | "cancelled"
    numberOfPeople: number
    note?: string
}