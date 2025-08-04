import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import TravelStory from "@/models/TravelStory";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    // Pastikan hanya admin
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const story = await TravelStory.findById(params.id);
    if (!story) {
      return NextResponse.json({ message: "Story not found" }, { status: 404 });
    }

    // Toggle nilai hidden (jika belum ada field hidden, kita tambahkan)
    story.hidden = !story.hidden;
    await story.save();

    return NextResponse.json({
      message: "Story visibility updated",
      hidden: story.hidden,
    });
  } catch (error) {
    console.error("❌ Error toggling story visibility:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
