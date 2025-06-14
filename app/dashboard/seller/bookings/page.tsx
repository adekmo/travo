'use client'

import { SellerBooking } from "@/types/sellerBooking"
import { useEffect, useState } from "react"

const SellerBookingPage = () => {

    const [bookings, setBookings] = useState<SellerBooking[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchBookings = async () => {
        const res = await fetch("/api/bookings/seller")
        if (res.ok) {
            const data = await res.json()
            setBookings(data)
        }
        setLoading(false)
        }

        fetchBookings()
    }, [])

    const handleUpdateStatus = async (id: string, status: "confirmed" | "cancelled") => {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })

      if (res.ok) {
        const updated = await res.json()
        setBookings(prev =>
          prev.map(b => (b._id === id ? { ...b, status: updated.status } : b))
        )
      } else {
        alert("Gagal mengubah status booking.")
      }
    }

    if (loading) return <div className="p-6">Loading...</div>
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Booking Masuk</h1>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <input
          type="text"
          placeholder="Cari customer atau paket..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-3 py-2 rounded w-full md:w-1/2"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border px-3 py-2 rounded w-full md:w-1/3"
        >
          <option value="all">Semua Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      {bookings.length === 0 ? (
        <p>Belum ada booking yang masuk.</p>
      ) : (
        <ul className="space-y-4">
          {bookings.filter((book) => {
            const matchesSearch =
              book.customerId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              book.packageId.title.toLowerCase().includes(searchTerm.toLowerCase())

            const matchesStatus =
              statusFilter === "all" ? true : book.status === statusFilter

            return matchesSearch && matchesStatus
          })
          .map((booking) => (
            <li key={booking._id} className="border rounded p-4 shadow-sm">
              <h2 className="text-lg font-semibold">{booking.packageId.title}</h2>
              <p><strong>Lokasi:</strong> {booking.packageId.location}</p>
              <p><strong>Customer:</strong> {booking.customerId.name} ({booking.customerId.email})</p>
              <p><strong>Tanggal Booking:</strong> {new Date(booking.date).toLocaleDateString()}</p>
              <p><strong>Jumlah Orang:</strong> {booking.numberOfPeople}</p>
              <p><strong>Total Harga:</strong> Rp {booking.packageId.price * booking.numberOfPeople}</p>
              {booking.note && <p><strong>Catatan:</strong> {booking.note}</p>}
              <p><strong>Status:</strong>{" "}
                <span className={
                  booking.status === "confirmed" ? "text-green-600" :
                  booking.status === "cancelled" ? "text-red-600" : "text-yellow-600"
                }>
                  {booking.status}
                </span>
              </p>
              {booking.status === "pending" && (
                <div className="mt-2 space-x-2">
                  <button
                    onClick={() => handleUpdateStatus(booking._id, "confirmed")}
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Konfirmasi
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(booking._id, "cancelled")}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Batalkan
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default SellerBookingPage