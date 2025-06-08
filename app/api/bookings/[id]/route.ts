import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import Booking from "@/models/Booking"
import { connectDB } from "@/lib/mongodb"

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB()
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const { status } = await req.json()
    const validStatus = ["confirmed", "cancelled"]
    if (!validStatus.includes(status)) {
      return NextResponse.json({ message: "Invalid status" }, { status: 400 })
    }

    const booking = await Booking.findByIdAndUpdate(
      params.id,
      { status },
      { new: true }
    )

    if (!booking) {
      return NextResponse.json({ message: "Booking not found" }, { status: 404 })
    }

    return NextResponse.json(booking)
  } catch (error) {
    console.error("Update booking error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
