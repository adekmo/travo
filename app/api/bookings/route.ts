import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from "@/lib/mongodb";
import Booking from '@/models/Booking'
import Notification from '@/models/Notification'
import TravelPackage from '@/models/TravelPackage'

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const { customerId, packageId, date, numberOfPeople, note } = await req.json()

    // Hitung jumlah booking untuk packageId + date (tanggal saja, tanpa jam)
    const targetDate = new Date(date)
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0))
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999))

    const existingBookings = await Booking.countDocuments({
      packageId,
      date: { $gte: startOfDay, $lte: endOfDay },
    })

    if (existingBookings >= 10) {
      return NextResponse.json(
        { message: 'Kuota booking untuk tanggal ini sudah penuh' },
        { status: 400 }
      )
    }

    const newBooking = await Booking.create({
      customerId,
      packageId,
      date,
      numberOfPeople,
      note,
    })

    const travelPackage = await TravelPackage.findById(packageId)
    if (travelPackage && travelPackage.seller) {
      const notif = await Notification.create({
        sellerId: travelPackage.seller,
        packageId,
        bookingId: newBooking._id,
        message: `Booking baru untuk paket: ${travelPackage.title}`,
        isRead: false,
      })
    }
    

    return NextResponse.json(newBooking)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Terjadi kesalahan' }, { status: 500 })
  }
}
