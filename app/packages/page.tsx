'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import PackageCard from '@/components/PackageCard'
import { TravelPackage } from '@/types/travelPackage'

import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'

const formatRupiah = (value: number) => `Rp${new Intl.NumberFormat('id-ID').format(value)}`

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

  const [search, setSearch] = useState('')
  const [location, setLocation] = useState('')
  const [minPrice, setMinPrice] = useState<number>(0)
  const [maxPrice, setMaxPrice] = useState<number>(10000000)
  // const [sort, setSort] = useState('')

  // useEffect(() => {
  //   const s = searchParams.get('search') || ''
  //   const l = searchParams.get('location') || ''
  //   const min = parseInt(searchParams.get('minPrice') || '0', 10)
  //   const max = parseInt(searchParams.get('maxPrice') || '10000000', 10)
  //   const sortParam = searchParams.get('sort') || ''

  //   setSearch(s)
  //   setLocation(l)
  //   setMinPrice(min)
  //   setMaxPrice(max)
  //   setSort(sortParam)
  // }, [searchParams])
  const fetchPackages = async () => {
    setLoading(true)
    const params = new URLSearchParams()

    if (search) params.set('search', search)
    if (location) params.set('location', location)
    if (minPrice) params.set('minPrice', minPrice.toString())
    if (maxPrice) params.set('maxPrice', maxPrice.toString())

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

  // const fetchPackages = async () => {
  //   setLoading(true)
  //   const params = new URLSearchParams()
  //   if (search) params.set('search', search)
  //   if (location) params.set('location', location)
  //   if (minPrice) params.set('minPrice', minPrice.toString())
  //   if (maxPrice) params.set('maxPrice', maxPrice.toString())
  //   if (sort) params.set('sort', sort)

  //   const formatRupiah = (value: number) =>
  //   `Rp${new Intl.NumberFormat('id-ID').format(value)}`

  //   const res = await fetch(`/api/packages?${params.toString()}`)
  //   if (res.ok) {
  //     const data = await res.json()
  //     setPackages(data)
  //   } else {
  //     alert('Gagal memuat paket')
  //   }
  //   setLoading(false)
  // }

  useEffect(() => {
    fetchPackages()
  }, [searchParams.toString()]) 

  const handleFilter = () => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (location) params.set('location', location)
    params.set('minPrice', minPrice.toString())
    params.set('maxPrice', maxPrice.toString())

    router.push(`/packages?${params.toString()}`)
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <input
        type="text"
        placeholder="Cari Judul"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border px-3 py-2 rounded w-full mb-4"
      />

      <input
        type="text"
        placeholder="Lokasi"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="border px-3 py-2 rounded w-full mb-4"
      />

      <div className="mb-6">
        <label className="block font-medium mb-2">
          Rentang Harga: {formatRupiah(minPrice)} - {formatRupiah(maxPrice)}
        </label>
        <Slider
          range
          min={0}
          max={10000000}
          step={100000}
          allowCross={false}
          value={[minPrice, maxPrice]}
          onChange={(values: number | number[]) => {
            if (Array.isArray(values)) {
              setMinPrice(values[0])
              setMaxPrice(values[1])
            }
          }}
        />
      </div>

      <button
        onClick={handleFilter}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-6"
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
        {loading ? (
          <p>Memuat paket...</p>
        ) : packages.length > 0 ? (
          packages.map((pkg) => <PackageCard key={pkg._id} pkg={pkg} />)
        ) : (
          <p>Tidak ada paket tersedia saat ini.</p>
        )}
      </div>
    </div>
  )
}
