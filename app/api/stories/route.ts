import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import TravelStory from "@/models/TravelStory";
import Booking from "@/models/Booking";
import Comment from "@/models/Comment";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url)
    const search = searchParams.get("search")
    const tags = searchParams.get("tags")?.split(",").filter(Boolean)
     const featured = searchParams.get("featured") === "true"

    const filter: any = {}

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } }
      ]
    }

    if (tags && tags.length > 0) {
      filter.tags = { $in: tags }
    }

    if (featured) {
      filter.featured = true
    }


    const stories = await TravelStory.find(filter)
      .sort({ createdAt: -1})
      .populate("userId", "name avatar")
      .populate("packageId", "title location")
    
    const storiesWithCommentCount = await Promise.all(
      stories.map(async (story) => {
        const commentCount = await Comment.countDocuments({ storyId: story._id });
        return {
          ...story.toObject(),
          commentCount: commentCount || 0,
        };
      })
    );
    
    return NextResponse.json(storiesWithCommentCount, {status: 200})
  } catch (error) {
    console.error("❌ Error fetching stories:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
    try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { packageId, title, content, media, tags } = body;

  
    const story = await TravelStory.create({
      userId: session.user.id,
      packageId,
      title,
      content,
      media,
      tags,
    });

    await Booking.findOneAndUpdate(
      { customerId: session.user.id, packageId },
      { hasStory: true }
    )

    return NextResponse.json(story, { status: 201 });
  } catch (error) {
    console.error("❌ Error creating story:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
