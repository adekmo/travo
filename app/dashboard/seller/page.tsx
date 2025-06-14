import SellerCharts from '@/components/SellerCharts'
import SellerReviewList from '@/components/SellerReviewList'
import SellerStats from '@/components/SellerStats'
import Link from 'next/link'
import React from 'react'

const SellerDashboardPage = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Dashboard Seller</h1>
      <Link href="/dashboard/profile" className="text-blue-600 underline mr-2">
          Edit Profil
      </Link>
      <Link href="/dashboard/seller/packages" className="text-blue-600 underline mr-2">
          Packages
      </Link>
      <Link href="/dashboard/seller/bookings" className="text-blue-600 underline mr-2">
          Booking
      </Link>
      <Link href="/dashboard/seller/reviews" className="text-blue-600 underline mr-2">
          Reviews
      </Link>

      <div>
        <SellerStats />
      </div>
      <div>
        <SellerReviewList />
      </div>
      <div>
        <SellerCharts />
      </div>
    </div>
  )
}

export default SellerDashboardPage