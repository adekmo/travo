import Link from 'next/link'
import React from 'react'

const CustomerDashboardPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Customer Dashboard</h1>
      <p>Halo Traveler! Temukan dan booking paket liburan impianmu di sini.</p>
      <Link href="/dashboard/profile" className="text-blue-600 underline mr-2">
        Edit Profil
      </Link>
      <Link href="/dashboard/customer/bookings" className="text-blue-600 underline mr-2">
        Booking
      </Link>
    </div>
  )
}

export default CustomerDashboardPage