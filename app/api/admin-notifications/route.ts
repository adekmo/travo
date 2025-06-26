import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import AdminNotification from '@/models/AdminNotification'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    await connectDB()

    const session = await getServerSession(authOptions);

    if(!session || session.user.role !== 'admin'){
      return NextResponse.json({ message: 'Unauthorized'}, { status: 401 })
    }
    
    const notifications = await AdminNotification.find()
      .sort({ createdAt: -1 })
      .limit(20)
      .populate('sellerId', 'name')
      .populate('packageId', 'title')
    return NextResponse.json({notifications})
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Gagal mengambil notifikasi' }, { status: 500 })
  }
}
