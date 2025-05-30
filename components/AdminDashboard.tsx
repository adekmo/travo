'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { TravelPackage } from '@/types/travelPackage'

const AdminDashboard = () => {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [packages, setPackages] = useState<TravelPackage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return

    if (!session || session.user.role !== 'admin') {
      router.push('/')
    } else {
      fetchPackages()
    }
  }, [status, session])

  const fetchPackages = async () => {
    try {
      const res = await fetch('/api/admin/packages')

      if (!res.ok) {
        throw new Error(`Fetch gagal: ${res.status}`)
      }

      const data = await res.json()
      setPackages(data)
    } catch (error) {
      console.error('Gagal mengambil paket:', error)
    } finally {
      setLoading(false)
    }
  }


   if (loading) return <p>Memuat data...</p>
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard Admin</h1>
      <table className="w-full table-auto border border-gray-300">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">Judul</th>
            <th className="p-2 border">Lokasi</th>
            <th className="p-2 border">Harga</th>
            <th className="p-2 border">Pembuat</th>
          </tr>
        </thead>
        <tbody>
          {packages.map((pkg) => (
            <tr key={pkg._id}>
              <td className="p-2 border">{pkg.title}</td>
              <td className="p-2 border">{pkg.location}</td>
              <td className="p-2 border">Rp{Number(pkg.price).toLocaleString()}</td>
              <td className="p-2 border">{pkg.seller?.name || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AdminDashboard