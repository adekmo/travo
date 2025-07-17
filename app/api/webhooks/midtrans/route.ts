import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  await connectDB()

  const body = await req.json()

  // Verifikasi signature Midtrans (opsional tapi direkomendasikan)
  const {
    order_id,
    status_code,
    gross_amount,
    signature_key,
    transaction_status,
  } = body

  const serverKey = process.env.MIDTRANS_SERVER_KEY || ''
  const hash = crypto
    .createHash('sha512')
    .update(order_id + status_code + gross_amount + serverKey)
    .digest('hex')

  // if (signature_key !== hash) {
  //   return NextResponse.json({ message: 'Invalid signature' }, { status: 403 })
  // }

  // Update status booking
  try {
    let newStatus: 'confirmed' | 'cancelled' | undefined

    if (transaction_status === 'settlement') {
      newStatus = 'confirmed'
    } else if (
      transaction_status === 'cancel' ||
      transaction_status === 'expire' ||
      transaction_status === 'deny'
    ) {
      newStatus = 'cancelled'
    }

    if (newStatus) {
      await Booking.findByIdAndUpdate(order_id, {
        status: newStatus,
      })
    }

    return NextResponse.json({ message: 'Webhook received' })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}