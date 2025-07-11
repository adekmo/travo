'use client'

import { Stat } from '@/types/stat'
import { Calendar, LucideIcon, Package, UserCheck, Users2 } from 'lucide-react'
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card title="Total Booking" value={stats.totalBookings} icon={Calendar} />
        <Card title="Total Paket" value={stats.totalPackages} icon={Package} />
        <Card title="Total Customer" value={stats.totalCustomers} icon={Users2} />
        <Card title="Total Seller" value={stats.totalSellers} icon={UserCheck} />
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

const Card = ({ title, value, icon: Icon }: { title: string; value: number; icon: LucideIcon  }) => (
  <div className='bg-blue-100 p-5 rounded'>
    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
      <h3 className="text-sm text-gray-500">{title}</h3>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </div>
    <div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  </div>
)

export default StatsCard