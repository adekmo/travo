import { connectDB } from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import Comment from "@/models/Comment";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const comments = await Comment.find({ storyId: params.id })
      .populate("userId", "name avatar")
      .sort({ createdAt: -1 });

    return NextResponse.json(comments);
  } catch (error) {
    console.error("GET Comment error:", error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { content } = await req.json();
    if (!content) {
      return NextResponse.json({ message: "Komentar tidak boleh kosong" }, { status: 400 });
    }

    const newComment = await Comment.create({
      storyId: params.id,
      userId: session.user.id,
      content,
    });

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error("POST Comment error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
