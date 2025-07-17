import { NextRequest, NextResponse } from 'next/server'
import midtransClient from 'midtrans-client'

export async function POST(req: NextRequest) {
  try {
    const { orderId, grossAmount, customerDetails } = await req.json()

    const snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY!,
    })

    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: grossAmount,
      },
      credit_card: {
        secure: true,
      },
      customer_details: customerDetails,
    }

    const transaction = await snap.createTransaction(parameter)

    return NextResponse.json({ token: transaction.token })
  } catch (error) {
    console.error('Midtrans Token Error:', error)
    return NextResponse.json({ message: 'Gagal membuat token pembayaran' }, { status: 500 })
  }
}
