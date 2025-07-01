// app/api/messages/chat-users/route.ts
import { authOptions } from "@/lib/auth"
import { connectDB } from "@/lib/mongodb"
import Message from "@/models/Message"
import User from "@/models/User"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    await connectDB()
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'seller') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const sellerId = session.user.id

    // Ambil ID customer unik yang pernah mengirim pesan ke seller
    const customerIds = await Message.distinct("senderId", { receiverId: sellerId })

    const customers = await User.find({ _id: { $in: customerIds } }).select("name")

    return NextResponse.json(customers)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}
