import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { connectDB } from "@/lib/mongodb"
import TravelPackage from "@/models/TravelPackage"
import TravelStory from "@/models/TravelStory"
import { Types } from "mongoose"

export async function GET() {
  try {
    await connectDB()
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "seller") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Ambil semua paket milik seller
    const sellerPackages = await TravelPackage.find({ seller: session.user.id }).lean()

    // Ambil ID semua paket
    const packageIds = sellerPackages.map((pkg) => pkg._id)

    // Hitung jumlah story per paket
    const storyCounts = await TravelStory.aggregate([
      { $match: { packageId: { $in: packageIds } } },
      { $group: { _id: "$packageId", totalStories: { $sum: 1 } } }
    ])

    // Ubah ke bentuk Map untuk pencocokan cepat
    const storyMap = new Map<string, number>()
    storyCounts.forEach((item) => {
      storyMap.set(item._id.toString(), item.totalStories)
    })

    // Gabungkan data dengan jumlah cerita
    const analytics = sellerPackages.map((pkg) => ({
      _id: pkg._id,
      title: pkg.title,
      location: pkg.location,
      image: pkg.image,
      totalStories: storyMap.get((pkg._id as Types.ObjectId).toString()) || 0
    }))

    return NextResponse.json(analytics)
  } catch (err) {
    console.error("❌ Error in seller story analytics:", err)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
