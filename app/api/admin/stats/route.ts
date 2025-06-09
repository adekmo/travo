import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Booking from "@/models/Booking"
import TravelPackage from "@/models/TravelPackage"
import User from "@/models/User"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET() {
  try {
    await connectDB()
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const totalBookings = await Booking.countDocuments()
    const totalPackages = await TravelPackage.countDocuments()
    const totalCustomers = await User.countDocuments({ role: "customer" })
    const totalSellers = await User.countDocuments({ role: "seller" })

    const bookingsByStatus = await Booking.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ])

    return NextResponse.json({
      totalBookings,
      totalPackages,
      totalCustomers,
      totalSellers,
      bookingsByStatus,
    })
  } catch (error) {
    console.error("Error getting stats:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
