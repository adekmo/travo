import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Notification from '@/models/Notification'

export async function PATCH(req: NextRequest) {
  try {
    await connectDB()
    const { notificationId } = await req.json()

    await Notification.findByIdAndUpdate(notificationId, { isRead: true })

    return NextResponse.json({ message: 'Notifikasi ditandai sebagai dibaca' })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Gagal update notifikasi' }, { status: 500 })
  }
}
