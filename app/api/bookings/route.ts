import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from "@/lib/mongodb";
import Booking from '@/models/Booking'
import Notification from '@/models/Notification'
import TravelPackage from '@/models/TravelPackage'
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    await connectDB()

    const session = await getServerSession(authOptions);

    if(!session || session.user.role !== 'customer'){
      return NextResponse.json({ message: 'Harap Login Terlebih Dahulu' }, { status: 401 });
    }
    const { packageId, date, numberOfPeople, note, contact } = await req.json()
    const customerId = session.user.id;

    if (!contact?.name || !contact?.email || !contact?.phone) {
      return NextResponse.json({ message: 'Informasi kontak tidak lengkap' }, { status: 400 })
    }

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
      contact: {
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
      },
    })

    const travelPackage = await TravelPackage.findById(packageId)
    if (travelPackage && travelPackage.seller) {
      const notif = await Notification.create({
        userId: travelPackage.seller,
        packageId,
        bookingId: newBooking._id,
        message: `Booking baru untuk paket: ${travelPackage.title}`,
        isRead: false,
      })
    }
    

    return NextResponse.json(newBooking, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Terjadi kesalahan' }, { status: 500 })
  }
}
