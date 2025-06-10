// app/api/seller/reviews/route.ts

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { connectDB } from "@/lib/mongodb";
import Review from "@/models/Review"
import TravelPackage from "@/models/TravelPackage"
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "seller") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  await connectDB()

  try {
    const sellerObjectId = new mongoose.Types.ObjectId(session.user.id)
    console.log("Seller ID:", sellerObjectId)

    const packages = await TravelPackage.find({ seller: sellerObjectId })
    console.log("Paket ditemukan:", packages)

    const packageIds = packages.map((p) => p._id)

    const reviews = await Review.find({ package: { $in: packageIds } })
        .populate("customer", "name")
        .populate("package", "title")

    return NextResponse.json(reviews)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: "Gagal mengambil review" }, { status: 500 })
  }
}
