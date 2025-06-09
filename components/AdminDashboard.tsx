'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
// import { TravelPackage } from '@/types/travelPackage'
import Link from 'next/link'
import StatsCard from './StatsCard'
import PackageTable from './PackageTable'

const AdminDashboard = () => {
  const { data: session, status } = useSession()
  const router = useRouter()

  if (status === 'loading') return <p>Memuat halaman...</p>

  if (!session || session.user.role !== 'admin') {
    router.push('/')
    return null
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard Admin</h1>

      {/* Statistik */}
      <StatsCard />

      <div className="my-6">
        <Link href="/dashboard/admin/bookings" className="text-blue-600 underline mr-2">
          Lihat Semua Booking
        </Link>
        <Link href="/dashboard/admin/users" className="text-blue-600 underline mr-2">
          Lihat Semua User
        </Link>
      </div>

      {/* Tabel Paket */}
      <PackageTable />
    </div>
  )
}

export default AdminDashboard