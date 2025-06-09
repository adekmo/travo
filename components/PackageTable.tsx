'use client'

import { TravelPackage } from '@/types/travelPackage'
import { useEffect, useState } from 'react'

const PackageTable = () => {
    const [packages, setPackages] = useState<TravelPackage[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchPackages = async () => {
        try {
            const res = await fetch('/api/admin/packages')
            const data = await res.json()
            setPackages(data)
        } catch (error) {
            console.error('Gagal mengambil paket:', error)
        } finally {
            setLoading(false)
        }
        }

        fetchPackages()
    }, [])

    const handleDelete = async (id: string) => {
        if (!confirm('Yakin ingin menghapus paket ini?')) return
        try {
        const res = await fetch(`/api/admin/packages/${id}`, {
            method: 'DELETE',
        })
        if (!res.ok) throw new Error()
        setPackages((prev) => prev.filter((p) => p._id !== id))
        } catch {
        alert('Gagal menghapus paket')
        }
    }

    if (loading) return <p>Memuat paket...</p>
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-4">Daftar Paket Wisata</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left text-gray-700">
            <thead className='bg-gray-100 font-semibold'>
            <tr className="bg-gray-100 text-left">
                <th className="p-2 border">Judul</th>
                <th className="p-2 border">Lokasi</th>
                <th className="p-2 border">Harga</th>
                <th className="p-2 border">Seller</th>
                <th className="p-2 border">Aksi</th>
            </tr>
            </thead>
            <tbody>
            {packages.map((pkg) => (
                <tr key={pkg._id}>
                <td className="p-2 border">{pkg.title}</td>
                <td className="p-2 border">{pkg.location}</td>
                <td className="p-2 border">Rp{Number(pkg.price).toLocaleString()}</td>
                <td className="p-2 border">{pkg.seller?.name || '-'}</td>
                <td className="p-2 border">
                    <button
                    onClick={() => handleDelete(pkg._id!)}
                    className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                    >
                    Hapus
                    </button>
                </td>
                </tr>
            ))}
            </tbody>
        </table>
      </div>
    </div>
  )
}

export default PackageTable