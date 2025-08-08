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

        if (!session || !session.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const sellerId = session.user.id;

        // ambil customer yang pernah mengirim pesan ke seller
        const conversations = await Message.aggregate([
            {
            $match: {
                receiverId: new mongoose.Types.ObjectId(sellerId),
            },
            },
            {
            $group: {
                _id: "$senderId",
                unreadCount: {
                $sum: {
                    $cond: [{ $eq: ["$isRead", false] }, 1, 0],
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
                as: "customer",
            },
            },
            { $unwind: "$customer" },
            {
            $project: {
                _id: 0,
                customerId: "$customer._id",
                customerName: "$customer.name",
                unreadCount: 1,
                latestMessage: 1,
                lastTime: 1,
            },
            },
            { $sort: { lastTime: -1 } },
        ]);

        return NextResponse.json(conversations);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
