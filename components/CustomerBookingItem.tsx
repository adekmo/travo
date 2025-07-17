'use client'

import { Booking } from "@/types/booking"
import { useState } from "react"

const formatRupiah = (number: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(number)

  interface Props {
  booking: Booking
  onCancel: (id: string) => void
}

const CustomerBookingItem = ({ booking, onCancel }: Props) => {

    const [submitting, setSubmitting] = useState(false)
    if (
      !booking.packageId ||
      typeof booking.packageId === "string" ||
      !("title" in booking.packageId)
    ) {
      return (
        <li className="border rounded p-4 shadow-sm bg-red-100 text-red-700">
          <p className="font-semibold">Paket wisata tidak tersedia atau belum berhasil dimuat.</p>
        </li>
      )
    }

    const handleSubmitReview = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setSubmitting(true)

        const form = e.currentTarget
        const rating = Number(form.rating.value)
        const comment = form.comment.value

        try {
        const res = await fetch("/api/reviews", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
            packageId: booking.packageId._id,
            rating,
            comment,
            }),
        })

        if (res.ok) {
            alert("Review berhasil dikirim!")
            window.location.reload()
        } else {
            const err = await res.json()
            alert(err.message || "Gagal mengirim review")
        }
        } finally {
        setSubmitting(false)
        }
    }
  
  return (
    <li className="border rounded p-4 shadow-sm">
      <h2 className="text-lg font-semibold">{booking.packageId.title}</h2>
      <p><strong>Lokasi:</strong> {booking.packageId.location}</p>
      <p><strong>Tanggal Booking:</strong> {new Date(booking.date).toLocaleDateString()}</p>
      <p><strong>Status:</strong> <span className={
        booking.status === "confirmed" ? "text-green-600" :
        booking.status === "cancelled" ? "text-red-600" : "text-yellow-600"
      }>{booking.status}</span></p>
      <p><strong>Jumlah Orang:</strong> {booking.numberOfPeople}</p>
      {booking.note && <p><strong>Catatan:</strong> {booking.note}</p>}
      <p><strong>Total Harga:</strong> {formatRupiah(booking.packageId.price * booking.numberOfPeople)}</p>

      {booking.status === "pending" && (
        <button
          className="mt-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          onClick={() => onCancel(booking._id)}
        >
          Batalkan Booking
        </button>
      )}

      {booking.status === "confirmed" && !booking.hasReviewed && (
        <form onSubmit={handleSubmitReview} className="mt-4 border-t pt-2">
          <p className="font-medium">Berikan Review:</p>
          <div className="mt-2">
            <label>
              Rating:
              <select name="rating" required className="ml-2 border rounded px-2 py-1">
                <option value="">Pilih</option>
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="mt-2">
            <label>
              Komentar:
              <textarea
                name="comment"
                className="w-full border rounded px-2 py-1 mt-1"
                placeholder="Tulis komentar (opsional)"
              ></textarea>
            </label>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="mt-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
          >
            {submitting ? "Mengirim..." : "Kirim Review"}
          </button>
        </form>
      )}
    </li>
  )
}

export default CustomerBookingItem