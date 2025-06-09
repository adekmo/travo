'use client'

import { Stat } from '@/types/stat'
import { useEffect, useState } from 'react'

const StatsCard = () => {
    const [stats, setStats] = useState<Stat | null>(null)

     useEffect(() => {
        const fetchStats = async () => {
        const res = await fetch('/api/admin/stats')
        if (res.ok) {
            const data = await res.json()
            setStats(data)
        }
        }

        fetchStats()
    }, [])

    if (!stats) return <p className="mb-4">Memuat statistik...</p>
  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card title="Total Booking" value={stats.totalBookings} />
        <Card title="Total Paket" value={stats.totalPackages} />
        <Card title="Total Customer" value={stats.totalCustomers} />
        <Card title="Total Seller" value={stats.totalSellers} />
      </div>
      <div className='bg-white rounded-lg shadow p-4 mb-6'>
        <h2 className="text-lg font-semibold mb-2">Booking Berdasarkan Status</h2>
        <ul className="list-disc pl-5 text-gray-700">
          {stats.bookingsByStatus.map((s) => (
            <li key={s._id}>
              {s._id.charAt(0).toUpperCase() + s._id.slice(1)}: {s.count}
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

const Card = ({ title, value }: { title: string; value: number; }) => (
  <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center justify-centerp-4 bg-white shadow rounded border text-center">
    <h3 className="text-sm text-gray-500">{title}</h3>
    <p className="text-2xl font-bold text-gray-800">{value}</p>
  </div>
)

export default StatsCard