'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import PackageCard from '@/components/PackageCard'
import { TravelPackage } from '@/types/travelPackage'

// const fetchPackages = async (): Promise<TravelPackage[]> => {
//   const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/packages`, {
//     cache: 'no-store',
//   })
//   if (!res.ok) {
//     throw new Error('Gagal memuat data paket')
//   }
//   return res.json()
// }

export default function PackagesPage() {

  const router = useRouter()
  const searchParams = useSearchParams()

  const [packages, setPackages] = useState<TravelPackage[]>([])
  const [loading, setLoading] = useState(false)

  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [location, setLocation] = useState(searchParams.get('location') || '')
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '')

  const fetchPackages = async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (location) params.set('location', location)
    if (minPrice) params.set('minPrice', minPrice)
    if (maxPrice) params.set('maxPrice', maxPrice)

    const sort = searchParams.get('sort') || ''
    if (sort) params.set('sort', sort)

    const res = await fetch(`/api/packages?${params.toString()}`)
    if (res.ok) {
      const data = await res.json()
      setPackages(data)
    } else {
      alert('Gagal memuat paket')
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchPackages()
  }, [searchParams.toString()]) 

  const handleFilter = () => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (location) params.set('location', location)
    if (minPrice) params.set('minPrice', minPrice)
    if (maxPrice) params.set('maxPrice', maxPrice)

    router.push(`/packages?${params.toString()}`)
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <input
        type="text"
        placeholder="Cari Judul"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border px-3 py-2 rounded w-full"
      />
      <input
        type="text"
        placeholder="Lokasi"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="border px-3 py-2 rounded w-full"
      />
      <div className="flex gap-4">
        <input
          type="number"
          placeholder="Harga Min"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="border px-3 py-2 rounded w-full"
        />
        <input
          type="number"
          placeholder="Harga Max"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="border px-3 py-2 rounded w-full"
        />
      </div>
      <button
        onClick={handleFilter}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Cari
      </button>
      <div className="mb-4">
        <label className="mr-2 font-medium">Sort:</label>
        <select
          value={searchParams.get('sort') || ''}
          onChange={(e) => {
            const params = new URLSearchParams(searchParams.toString())
            const value = e.target.value
            if (value) {
              params.set('sort', value)
            } else {
              params.delete('sort')
            }
            router.push(`/packages?${params.toString()}`)
          }}
          className="border px-3 py-2 rounded"
        >
          <option value="">Default</option>
          <option value="price_asc">Harga Termurah</option>
          <option value="price_desc">Harga Termahal</option>
          <option value="newest">Terbaru</option>
        </select>
      </div>
      <h1 className="text-3xl font-bold mb-6">Paket Travel Tersedia</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {packages.length > 0 ? (
          packages.map((pkg) => <PackageCard key={pkg._id} pkg={pkg} />)
        ) : (
          <p>Tidak ada paket tersedia saat ini.</p>
        )}
      </div>
    </div>
  )
}
