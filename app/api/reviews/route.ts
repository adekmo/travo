import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Review from "@/models/Review";
import Booking from "@/models/Booking";

export async function POST(req: Request) {
  await connectDB();

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { packageId, rating, comment } = await req.json();

  if (!packageId || !rating) {
    return NextResponse.json(
      { message: "packageId dan rating wajib diisi." },
      { status: 400 }
    );
  }

  try {
    // Cek apakah user pernah booking paket ini dan belum review
    const booking = await Booking.findOne({
      customerId: session.user.id,
      packageId,
      status: "confirmed",
      hasReviewed: false,
    });

    console.log("DEBUG booking check:", {
  customerId: session.user.id,
  packageId,
  bookingFound: !!booking
});

    if (!booking) {
      return NextResponse.json(
        { message: "Anda belum bisa memberikan review untuk paket ini." },
        { status: 400 }
      );
    }

    // Tambahkan review
    await Review.create({
      customer: session.user.id,
      package: packageId,
      rating,
      comment,
    });

    // Update booking agar tidak bisa review dua kali
    booking.hasReviewed = true;
    await booking.save();

    return NextResponse.json({ message: "Review berhasil ditambahkan." });
  } catch (error) {
    console.error("Error saat membuat review:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
}
