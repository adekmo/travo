import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import Notification from '@/models/Notification'

export async function GET() {
  try {
    await connectDB()
    const session = await getServerSession(authOptions)
    const user = session?.user

    if (!user || user.role !== 'seller') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const notifications = await Notification.find({ userId: user.id })
      .sort({ createdAt: -1 })
      console.log('notifRead', notifications);
      

    return NextResponse.json(notifications)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Failed to fetch notifications' }, { status: 500 })
  }
}

export async function PATCH() {
  try {
    await connectDB()
    const session = await getServerSession(authOptions)
    const user = session?.user

    if (!user || user.role !== 'seller') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Tandai semua sebagai read
    await Notification.updateMany({ sellerId: user.id, isRead: false }, { $set: { isRead: true } })

    return NextResponse.json({ message: 'Notifikasi ditandai sebagai dibaca' })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Gagal update notifikasi' }, { status: 500 })
  }
}
