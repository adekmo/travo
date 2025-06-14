import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import TravelPackage from "@/models/TravelPackage";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "seller") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const sellerId = new mongoose.Types.ObjectId(session.user.id);

  try {
    // Ambil paket milik seller
    const sellerPackages = await TravelPackage.find({ seller: sellerId });
    const packageIds = sellerPackages.map(p => p._id);

    // Group booking by bulan
    const bookings = await Booking.aggregate([
    {
        $match: {
        packageId: { $in: packageIds },
        status: "confirmed"
        }
    },
    // Join data package untuk ambil harga
    {
        $lookup: {
        from: "travelpackages", // sesuai nama koleksi
        localField: "packageId",
        foreignField: "_id",
        as: "package"
        }
    },
    {
        $unwind: "$package"
    },
    {
        $addFields: {
        totalPrice: { $multiply: ["$numberOfPeople", "$package.price"] }
        }
    },
    {
        $group: {
        _id: {
            year: { $year: "$date" },
            month: { $month: "$date" }
        },
        totalBooking: { $sum: 1 },
        totalRevenue: { $sum: "$totalPrice" }
        }
    },
    {
        $sort: { "_id.year": 1, "_id.month": 1 }
    }
    ]);

    // Format agar cocok dengan chart
    const formatted = bookings.map(item => ({
      month: `${item._id.month}/${item._id.year}`,
      bookings: item.totalBooking,
      revenue: item.totalRevenue
    }));

    return NextResponse.json(formatted);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
