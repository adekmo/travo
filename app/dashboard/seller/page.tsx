import SellerCharts from '@/components/SellerCharts'
import SellerReviewList from '@/components/SellerReviewList'
import SellerStats from '@/components/SellerStats'
import Link from 'next/link'
import React from 'react'

const SellerDashboardPage = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Dashboard Seller</h1>
      <div>
        <SellerStats />
      </div>
      <div>
        <SellerReviewList limit={5} showSeeMore />
      </div>
      <div>
        <SellerCharts />
      </div>
    </div>
  )
}

export default SellerDashboardPage