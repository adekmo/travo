import { connectDB } from "@/lib/mongodb"
import TravelStory from "@/models/TravelStory"
// import User from "@/models/User"
// import TravelPackage from "@/models/TravelPackage"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await params;
    const story = await TravelStory.findById(id)
      .populate("userId", "name image avatar like")
      .populate("packageId", "title location")

    if (!story) {
      return NextResponse.json({ message: "Not Found" }, { status: 404 })
    }

    return NextResponse.json(story)
  } catch (err) {
    console.error("🔴 Error getting story detail:", err)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
