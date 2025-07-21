import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import TravelStory from "@/models/TravelStory";
import Booking from "@/models/Booking";

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
