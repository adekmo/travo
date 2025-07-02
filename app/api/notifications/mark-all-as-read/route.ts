import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Notification from '@/models/Notification'

export async function PATCH(req: NextRequest) {
  try {
    await connectDB()
    const { userId } = await req.json()

    if (!userId) {
      return NextResponse.json({ message: "sellerId wajib diisi" }, { status: 400 })
    }

    await Notification.updateMany(
      { userId, isRead: false },
      { $set: { isRead: true } }
    )

    return NextResponse.json({ message: "Notifikasi ditandai sebagai dibaca" })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: "Terjadi kesalahan" }, { status: 500 })
  }
}
