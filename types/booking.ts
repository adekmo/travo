export interface Booking  {
    _id: string
    packageId: {
        _id: string
        title: string
        location: string
        price: number
    }
    date: string
    status: "pending" | "confirmed" | "cancelled"
    numberOfPeople: number
    note?: string
    hasReviewed?: boolean
    hasStory?: boolean
}