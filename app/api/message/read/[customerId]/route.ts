// app/api/message/read/[customerId]/route.ts

import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Message from "@/models/Message";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export async function POST(req: NextRequest, { params }: { params: { customerId: string } }) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const sellerId = new mongoose.Types.ObjectId(session.user.id);
    const customerId = new mongoose.Types.ObjectId(params.customerId);
    await Message.updateMany(
      { senderId: customerId, receiverId: sellerId, isRead: false },
      { $set: { isRead: true } }
    );

    return NextResponse.json({ message: "Marked as read" });
  } catch (error) {
    console.error('terdapat kesalahan', error);
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
