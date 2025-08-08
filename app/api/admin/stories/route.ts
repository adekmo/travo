// app/api/admin/stories/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import TravelStory from "@/models/TravelStory";
import Comment from "@/models/Comment";

import { Types } from "mongoose";

export async function GET() {
  try {
    await connectDB();

    // Ambil semua story
    const stories = await TravelStory.find()
      .sort({ createdAt: -1 })
      .populate("userId", "name avatar")
      .populate("packageId", "title location")
      .lean();

    // Ambil semua komentar sekaligus
    const commentCounts = await Comment.aggregate([
      { $group: { _id: "$storyId", count: { $sum: 1 } } }
    ]);

    // Ubah ke bentuk Map untuk pencocokan cepat
    const commentMap = new Map<string, number>();
    commentCounts.forEach((item) => {
      commentMap.set(item._id.toString(), item.count);
    });

    // Gabungkan jumlah komentar ke masing-masing story
    const enrichedStories = stories.map((story) => ({
      ...story,
      commentCount: commentMap.get((story._id as Types.ObjectId).toString()) || 0,
    }));

    return NextResponse.json(enrichedStories);
  } catch (error) {
    console.error("❌ Error fetching admin stories:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
