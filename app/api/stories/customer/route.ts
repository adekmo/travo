import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import TravelStory from "@/models/TravelStory";
// import TravelPackage from "@/models/TravelPackage";

export async function GET() {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const stories = await TravelStory.find({ userId: session.user.id })
      .populate("packageId")
      .sort({ createdAt: -1 });

    return NextResponse.json(stories);
  } catch (error) {
    console.error("❌ Error fetching customer stories:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
