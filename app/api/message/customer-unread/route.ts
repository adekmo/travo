import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Message from "@/models/Message";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'customer') {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const customerId = new mongoose.Types.ObjectId(session.user.id);

    const unreadCount = await Message.countDocuments({
      receiverId: customerId,
      isRead: false,
    });

    return NextResponse.json({ unreadExists: unreadCount > 0 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
