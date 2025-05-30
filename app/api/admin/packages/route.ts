import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb';
import TravelPackage from '@/models/TravelPackage'

export async function GET() {
  try {
    await connectDB()
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const packages = await TravelPackage.find().populate('seller', 'name email')
    return NextResponse.json(packages)
  } catch (error) {
    console.error('Error in admin GET packages:', error)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}
