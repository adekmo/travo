// app/api/seller/stats/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import TravelPackage from "@/models/TravelPackage";
import Booking from "@/models/Booking";
import Review from "@/models/Review";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "seller") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  try {
    const sellerObjectId = new mongoose.Types.ObjectId(session.user.id);

    // 1. Cari semua paket milik seller
    const packages = await TravelPackage.find({ seller: sellerObjectId });
    const packageIds = packages.map((p) => p._id);

    // 2. Jumlah total paket
    const totalPackages = packages.length;

    // jumlah booking berdasarkan status
    const pendingBookingsCount = await Booking.countDocuments({
      packageId: { $in: packageIds },
      status: "pending",
    });

    // 3. Jumlah booking
    const totalBookings = await Booking.countDocuments({
      packageId: { $in: packageIds },
    });

    // 4. Total pendapatan dari booking yang sudah dikonfirmasi
    const confirmedBookings = await Booking.find({
      packageId: { $in: packageIds },
      status: "confirmed",
    });
    const confirmedBookingsCount = confirmedBookings.length;

    const totalRevenue = confirmedBookings.reduce((sum, booking) => {
      const pkg = packages.find((p) => p._id.equals(booking.packageId));
      return sum + (pkg?.price || 0) * booking.numberOfPeople;
    }, 0);

    // 5. Jumlah review & rata-rata rating
    const reviews = await Review.find({ package: { $in: packageIds } });
    const totalReviews = reviews.length;
    const avgRating =
      totalReviews > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
        : 0;

    return NextResponse.json({
      totalPackages,
      totalBookings,
      pendingBookings: pendingBookingsCount,
      confirmedBookings: confirmedBookingsCount,
      totalRevenue,
      totalReviews,
      avgRating: Number(avgRating.toFixed(2)),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Gagal mengambil statistik" }, { status: 500 });
  }
}
