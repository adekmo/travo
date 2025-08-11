import { connectDB } from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import TravelStory from "@/models/TravelStory";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const story = await TravelStory.findById(id);
    if (!story) {
      return NextResponse.json({ message: "Story not found" }, { status: 404 });
    }

    const userId = session.user.id;
    const hasLiked = story.likes.includes(userId);

    if (hasLiked) {
      // Un-like
      story.likes = story.likes.filter((id: string) => id !== userId);
    } else {
      // Like
      story.likes.push(userId);
    }

    await story.save();

    return NextResponse.json({ liked: !hasLiked, totalLikes: story.likes.length });
  } catch (error) {
    console.error("Like error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
