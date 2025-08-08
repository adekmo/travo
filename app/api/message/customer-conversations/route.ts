// app/api/message/customer-conversations/route.ts
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Message from "@/models/Message";
// import User from "@/models/User";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET() {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'customer') {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const customerId = session.user.id;

    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { senderId: new mongoose.Types.ObjectId(customerId) },
            { receiverId: new mongoose.Types.ObjectId(customerId) },
          ],
        },
      },
      {
        $addFields: {
          otherUserId: {
            $cond: [
              { $eq: ["$senderId", new mongoose.Types.ObjectId(customerId)] },
              "$receiverId",
              "$senderId",
            ],
          },
        },
      },
      {
        $group: {
          _id: "$otherUserId",
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$receiverId", new mongoose.Types.ObjectId(customerId)] },
                    { $eq: ["$isRead", false] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          latestMessage: { $last: "$message" },
          lastTime: { $last: "$createdAt" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "seller",
        },
      },
      { $unwind: "$seller" },
      {
        $project: {
          sellerId: "$seller._id",
          sellerName: "$seller.name",
          unreadCount: 1,
          latestMessage: 1,
          lastTime: 1,
        },
      },
      { $sort: { lastTime: -1 } },
    ]);

    return NextResponse.json(conversations);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
