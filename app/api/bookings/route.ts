// app/api/bookings/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Booking from "@/models/Booking";
import { connectDB } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "customer") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { packageId, numberOfPeople, note } = await req.json();

  try {
    const booking = await Booking.create({
      customerId: session.user.id,
      packageId,
      numberOfPeople,
      note,
    })
    return NextResponse.json(booking)
  } catch (error) {
    console.error("Booking error:", error)
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 })
  }
}
