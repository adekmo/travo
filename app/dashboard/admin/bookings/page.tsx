'use client'

import { AdminBooking } from "@/types/adminBooking"
import { useEffect, useState } from "react"

const AdminDashboardBookingPage = () => {
    const [bookings, setBookings] = useState<AdminBooking[]>([])
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const fetchBookings = async () => {
        const res = await fetch("/api/admin/bookings")
        if (res.ok) {
            const data = await res.json()
            setBookings(data)
            setLoading(false);
        }
        }

        fetchBookings()
    }, [])

    const handleDelete = async (id: string) => {
        const confirmDel = confirm("Yakin hapus booking ini?");
        if (!confirmDel) return;
        const res = await fetch(`/api/admin/bookings/${id}`, { method: "DELETE" })
        if (res.ok) {
        setBookings(prev => prev.filter(b => b._id !== id))
        } else {
        alert("Gagal menghapus booking")
        }
    }
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Semua Booking</h1>

      {loading ?  
      (
        <p>Memuat data...</p>
      ) : bookings.length === 0 ? (
        <p>Tidak ada Paket Booking</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
          {/* <ul className="space-y-4"> */}
          {bookings.map((booking: AdminBooking) => (
            <div key={booking._id} className="bg-blue-100 border p-4 rounded shadow-sm">
              <p><strong>Customer:</strong> {booking.customerId?.name || '-'}</p>
              <p><strong>Paket:</strong> {booking.packageId?.title || '-'}</p>
              <p><strong>Status:</strong> {booking.status}</p>
              <button
                className="mt-2 px-3 py-1 bg-red-500 text-white rounded"
                onClick={() => handleDelete(booking._id)}
              >
                Hapus Booking
              </button>
            </div>
          ))}
          {/* </ul> */}
        </div>
      )   
      }
    </div>
  )
}

export default AdminDashboardBookingPage