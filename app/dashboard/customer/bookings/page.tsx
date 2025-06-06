'use client'

import { useEffect, useState } from "react"
import { Booking } from "@/types/booking"

const CustomerBookingPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  
  const formatRupiah = (number: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(number)

  useEffect(() => {
    const fetchBookings = async () => {
      const res = await fetch("/api/bookings/customer")
      if (res.ok) {
        const data = await res.json()
        setBookings(data)
      }
      setLoading(false)
    }

    fetchBookings()
  }, [])

  
  if (loading) return <div className="p-6">Loading...</div>
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Riwayat Booking Anda</h1>
      {bookings.length === 0 ? (
        <p>Anda belum memiliki booking.</p>
      ) : (
        <ul className="space-y-4">
          {bookings.map((booking) => (
            <li key={booking._id} className="border rounded p-4 shadow-sm">
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
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default CustomerBookingPage