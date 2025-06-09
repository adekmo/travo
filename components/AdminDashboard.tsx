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
    <div className='p-6'>
      <h1 className="text-3xl font-bold mb-6">Dashboard Admin</h1>

      {/* Statistik */}
      <StatsCard />

      <div className="mt-4 space-x-4">
        <Link href="/dashboard/admin/bookings" className="text-blue-600 hover:underline font-medium">
          Lihat Semua Booking
        </Link>
        <Link href="/dashboard/admin/users" className="text-blue-600 hover:underline font-medium">
          Lihat Semua User
        </Link>
      </div>

      {/* Tabel Paket */}
      <PackageTable />
    </div>
  )
}

export default AdminDashboard