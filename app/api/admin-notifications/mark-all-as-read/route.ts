import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import AdminNotification from '@/models/AdminNotification'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function PATCH() {
  try {
    await connectDB()
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    await AdminNotification.updateMany({ isRead: false }, { isRead: true })

    return NextResponse.json({ message: 'Semua notifikasi ditandai sebagai dibaca' })
  } catch (error) {
    console.error('Error marking admin notifications:', error)
    return NextResponse.json({ message: 'Terjadi kesalahan' }, { status: 500 })
  }
}
