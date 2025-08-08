'use client'

import { useCallback, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import PackageCard from '@/components/PackageCard'
import { TravelPackage } from '@/types/travelPackage'

export default function PackagesPage() {
  const [packages, setPackages] = useState<TravelPackage[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [location, setLocation] = useState('')
  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(10000000)
  const [selectedCategory, setSelectedCategory] = useState('')
  const searchParams = useSearchParams()
  const router = useRouter()

  const fetchPackages = useCallback(async () => {
    setLoading(true)

    const params = new URLSearchParams()

    const currentSearch = searchParams.get('search') || ''
    const currentLoc = searchParams.get('location') || ''
    const currentMinPrice = Number(searchParams.get('minPrice')) || 0
    const currentMaxPrice = Number(searchParams.get('maxPrice')) || 10000000
    const currentCategory = searchParams.get('category') || ''
    const sort = searchParams.get('sort') || ''

    if (currentSearch) params.set('search', currentSearch)
    if (currentLoc) params.set('location', currentLoc)
    if (currentMinPrice) params.set('minPrice', currentMinPrice.toString())
    if (currentMaxPrice) params.set('maxPrice', currentMaxPrice.toString())
    if (currentCategory) params.set('category', currentCategory)
    if (sort) params.set('sort', sort)

    try {
      const res = await fetch(`/api/packages?${params.toString()}`)
      if (res.ok) {
        const data = await res.json()
        setPackages(data)
      } else {
        alert('Gagal memuat paket')
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error fetching packages:', error)
        alert(`Gagal memuat paket: ${error.message}`)
      } else {
        console.error('Unknown error:', error)
        alert('Gagal memuat paket.')
      }
      setPackages([])
    } finally {
      setLoading(false)
    }
  }, [searchParams])

  useEffect(() => {
    setSearch(searchParams.get('search') || '')
    setLocation(searchParams.get('location') || '')
    setMinPrice(Number(searchParams.get('minPrice')) || 0)
    setMaxPrice(Number(searchParams.get('maxPrice')) || 10000000)
    setSelectedCategory(searchParams.get('category') || '')

    fetchPackages()
  }, [fetchPackages])

  const handleFilter = () => {
    const params = new URLSearchParams()

    if (search) params.set('search', search)
    if (location) params.set('location', location)
    if (minPrice) params.set('minPrice', minPrice.toString())
    if (maxPrice) params.set('maxPrice', maxPrice.toString())
    if (selectedCategory) params.set('category', selectedCategory)

    router.push(`/packages?${params.toString()}`)
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Daftar Paket Wisata</h1>

      {/* Filter Form */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <input
          type="text"
          placeholder="Cari judul..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Lokasi..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Harga min"
          value={minPrice}
          onChange={(e) => setMinPrice(Number(e.target.value))}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Harga max"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="border p-2 rounded"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Kategori</option>
          <option value="pantai">Pantai</option>
          <option value="gunung">Gunung</option>
          <option value="sejarah">Sejarah</option>
          {/* Tambahkan kategori lain jika ada */}
        </select>
      </div>

      <button
        onClick={handleFilter}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-6"
      >
        Terapkan Filter
      </button>

      {/* Daftar Paket */}
      {loading ? (
        <p>Memuat paket...</p>
      ) : packages.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <PackageCard key={pkg._id} pkg={pkg} />
          ))}
        </div>
      ) : (
        <p>Tidak ada paket ditemukan.</p>
      )}
    </div>
  )
}
