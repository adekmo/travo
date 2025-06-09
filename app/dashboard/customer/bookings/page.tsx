'use client'

import { useEffect, useState } from "react"
import { Booking } from "@/types/booking"
import CustomerBookingItem from "@/components/CustomerBookingItem"

const CustomerBookingPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  

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

  const handleCancel = async (id: string) => {
    const confirmCancel = confirm("Yakin ingin membatalkan booking ini?")
    if (!confirmCancel) return

    const res = await fetch(`/api/bookings/${id}`, { method: "DELETE" })
    if (res.ok) {
      setBookings(prev => prev.filter(b => b._id !== id))
    } else {
      const err = await res.json()
      alert(err.message || "Gagal membatalkan booking")
    }
  }

  
  if (loading) return <div className="p-6">Loading...</div>
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Riwayat Booking Anda</h1>
      {bookings.length === 0 ? (
        <p>Anda belum memiliki booking.</p>
      ) : (
        <ul className="space-y-4">
          {bookings.map((booking) => (
            <CustomerBookingItem
              key={booking._id}
              booking={booking}
              onCancel={handleCancel}
            />
          ))}
        </ul>
      )}
    </div>
  )
}

export default CustomerBookingPage