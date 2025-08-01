import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Booking from "@/models/Booking";
import { connectDB } from "@/lib/mongodb";

export async function GET() {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const bookings = await Booking.find({ customerId: session.user.id })
    .populate("packageId")
    .sort({ createdAt: -1 });

    // const sorted = bookings.sort((a, b) => b.createdAt - a.createdAt);
    const validBookings = bookings.filter(b => b.packageId && typeof b.packageId !== "string");

    const sorted = validBookings.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).reverse();
    // console.log("✅ Fetched bookings count:", sorted.length);
    // console.log("Booking sample:", bookings[0])
    return NextResponse.json(sorted);
  } catch (error) {
    console.error("🔴 Error in booking GET:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}