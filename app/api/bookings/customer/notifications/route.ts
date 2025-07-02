import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import Notification from '@/models/Notification'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    await connectDB()
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'customer') {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const notifs = await Notification.find({ userId: session.user.id }).sort({ createdAt: -1 })

    return NextResponse.json(notifs)
  } catch (error) {
    console.error("Error fetching seller bookings:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
