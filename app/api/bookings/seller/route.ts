import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { connectDB } from "@/lib/mongodb"
import Booking from "@/models/Booking"
import TravelPackage from "@/models/TravelPackage"

export async function GET() {
  try {
    await connectDB()
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Ambil semua _id paket milik seller
    const packages = await TravelPackage.find({ seller: session.user.id }).select("_id")

    const packageIds = packages.map(p => p._id)

    // Ambil semua booking untuk paket-paket tersebut
    const bookings = await Booking.find({ packageId: { $in: packageIds } })
      .populate("customerId", "name email")
      .populate("packageId", "title location price")
      .sort({ createdAt: -1 })

    return NextResponse.json(bookings)
  } catch (error) {
    console.error("Error fetching seller bookings:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
