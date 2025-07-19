import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import mongoose from "mongoose"
import { sendBookingEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  await connectDB();

  const body = await req.json();
  console.log("🔥 Webhook masuk:", body);

  const serverKey = process.env.MIDTRANS_SERVER_KEY as string;
  const signatureKeyHeader = req.headers.get("x-callback-signature-key") || "";

  // 1. Validasi signature
  const crypto = await import("crypto");
  const computedSignature = crypto
    .createHash("sha512")
    .update(body.order_id + body.status_code + body.gross_amount + serverKey)
    .digest("hex");

  if (computedSignature !== body.signature_key) {
    return NextResponse.json({ message: "Invalid signature" }, { status: 403 });
  }

  // 2. Ambil bookingId dari order_id format: TRV-<bookingId>
  const parts = body.order_id.split("-");
  const bookingId = parts.length > 1 ? parts[1] : null;
  if (!bookingId) {
    return NextResponse.json({ message: "Invalid order_id format" }, { status: 400 });
  }

  try {
    const booking = await Booking.findOne({
      _id: new mongoose.Types.ObjectId(bookingId),
    })

    if (!booking) {
      return NextResponse.json({ message: "Booking not found" }, { status: 404 });
    }

    // 3. Update status booking
    const status = body.transaction_status;

    if (status === "settlement" || status === "capture") {
      booking.status = "confirmed";
      await booking.populate("packageId")
      if (booking.contact?.email) {
        await sendBookingEmail({
          to: booking.contact.email,
          name: booking.contact.name || "Customer",
          orderId: body.order_id,
          packageTitle: booking.packageId?.title || "Paket Wisata",
          date: new Date(booking.date).toLocaleDateString(),
          numberOfPeople: booking.numberOfPeople,
          total: Number(body.gross_amount),
        })
      }
    } else if (status === "cancel" || status === "expire") {
      booking.status = "cancelled";
    }

    if (booking.contact?.name && booking.contact?.email && booking.contact?.phone) {
        await booking.save() // validasi aktif
    } else {
        await booking.save({ validateBeforeSave: false }) // fallback
    }

    console.log("Webhook masuk", body)

    return NextResponse.json({ message: "Notification processed" });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
