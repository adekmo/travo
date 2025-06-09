export interface Stat {
  totalBookings: number
  totalPackages: number
  totalCustomers: number
  totalSellers: number
  bookingsByStatus: { _id: string; count: number }[]
}