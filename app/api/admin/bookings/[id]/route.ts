import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Booking from "@/models/Booking";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // const booking = await Booking.findById(params.id);
    const deleteBooking = await Booking.findByIdAndDelete(params.id);

    if (!deleteBooking) {
      return NextResponse.json({ message: "Booking not found" }, { status: 404 });
    }

    // await Booking.findByIdAndDelete(params.id);

    return NextResponse.json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.error("Delete Booking Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
