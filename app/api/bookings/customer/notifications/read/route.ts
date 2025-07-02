import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import Notification from '@/models/Notification'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

export async function PATCH() {
  try {
    await connectDB()
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'customer') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    await Notification.updateMany(
      { userId: session.user.id, isRead: false },
      { $set: { isRead: true } }
    )

    return NextResponse.json({ message: 'All marked as read' })
  } catch (error) {
    console.error('Gagal update notifikasi:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
