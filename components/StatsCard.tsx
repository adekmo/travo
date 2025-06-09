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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card title="Total Booking" value={stats.totalBookings} />
        <Card title="Total Paket" value={stats.totalPackages} />
        <Card title="Total Customer" value={stats.totalCustomers} />
        <Card title="Total Seller" value={stats.totalSellers} />
      </div>
      <div>
        <h2 className="font-semibold mb-2">Booking Berdasarkan Status</h2>
        <ul className="list-disc list-inside text-sm text-gray-700">
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
  <div className="p-4 bg-white shadow rounded border text-center">
    <h3 className="text-gray-500 text-sm">{title}</h3>
    <p className="text-xl font-bold">{value}</p>
  </div>
)

export default StatsCard