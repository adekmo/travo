import Link from 'next/link'
import React from 'react'

const SellerDashboardPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Seller Dashboard</h1>
      <p>Selamat datang Seller. Di sini kamu bisa mengelola paket liburan dan melihat pesanan customer.</p>
      <Link href="/dashboard/profile" className="text-blue-600 underline mr-2">
          Edit Profil
      </Link>
      <Link href="/dashboard/seller/packages" className="text-blue-600 underline mr-2">
          Packages
      </Link>
      <Link href="/dashboard/seller/bookings" className="text-blue-600 underline mr-2">
          Booking
      </Link>
    </div>
  )
}

export default SellerDashboardPage