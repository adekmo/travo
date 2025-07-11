'use client'

import { SellerBooking } from "@/types/sellerBooking"
import { Check, X } from "lucide-react"
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
    <div className="grid grid-cols-1 gap-6 mb-8">
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
        <div className="space-y-4">
          {bookings.filter((book) => {
            const matchesSearch =
              book.customerId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              book.packageId.title.toLowerCase().includes(searchTerm.toLowerCase())

            const matchesStatus =
              statusFilter === "all" ? true : book.status === statusFilter

            return matchesSearch && matchesStatus
          })
          .map((booking) => (
            <div key={booking._id} className="flex items-center justify-between p-5 bg-muted/50 rounded-lg">
              <div className="flex-1">
                <p className="font-medium text-sm">
                  {booking.packageId.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {booking.customerId.name} • {booking.numberOfPeople} orang
                </p>
                <p className="text-xs text-muted-foreground">
                  {booking.note}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(booking.date).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium text-sm">
                  Rp {booking.packageId.price * booking.numberOfPeople}
                </p>
                <span
                    className={`text-xs px-2 py-1 rounded-full ${booking.status === "confirmed" ? "text-green-600" :
                  booking.status === "cancelled" ? "text-red-600" : "text-yellow-600"}`}
                >
                  {booking.status}
                </span>
              </div>
              {/* <h2 className="text-lg font-semibold">{booking.packageId.title}</h2>
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
              </p> */}
              {booking.status === "pending" && (
                <div className="ml-5 mt-2 space-x-2">
                  <button
                    onClick={() => handleUpdateStatus(booking._id, "confirmed")}
                    className="font-medium text-white text-sm px-3 py-1 bg-green-600 rounded hover:bg-green-700"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(booking._id, "cancelled")}
                    className=" font-medium text-white text-sm px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SellerBookingPage