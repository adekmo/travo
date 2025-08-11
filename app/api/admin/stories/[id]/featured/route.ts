// app/api/admin/stories/[id]/featured/route.ts
import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import TravelStory from "@/models/TravelStory"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params;
    const story = await TravelStory.findById(id)
    if (!story) {
      return NextResponse.json({ message: "Story not found" }, { status: 404 })
    }

    story.featured = !story.featured
    await story.save()

    return NextResponse.json({ message: "Featured status updated", featured: story.featured })
  } catch (err) {
    console.error("❌ Error toggling featured:", err)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
