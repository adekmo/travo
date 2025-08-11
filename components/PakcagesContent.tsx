'use client'

import 'rc-slider/assets/index.css'
import Slider from 'rc-slider'
import { useCallback, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import PackageCard from '@/components/PackageCard'
import { Category } from '@/types/category'
import { TravelPackage } from '@/types/travelPackage'
import { DollarSign, Filter, Map, MapPin, Search } from 'lucide-react'

const formatRupiah = (value: number) =>
  `Rp${new Intl.NumberFormat('id-ID').format(value)}`

export default function PackagesContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  // convert to string once so dependencies are stable & ESLint-friendly
  const paramsString = searchParams.toString()

  const [packages, setPackages] = useState<TravelPackage[]>([])
  const [loading, setLoading] = useState(false)

  const [search, setSearch] = useState('')
  const [location, setLocation] = useState('')
  const [minPrice, setMinPrice] = useState<number>(0)
  const [maxPrice, setMaxPrice] = useState<number>(10000000)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [categories, setCategories] = useState<Category[]>([])

  // Ambil daftar kategori — tidak bergantung pada searchParams
  useEffect(() => {
    let mounted = true
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories')
        if (!res.ok) return
        const data = await res.json()
        if (mounted) setCategories(data)
      } catch (e) {
        console.error('Failed to fetch categories', e)
      }
    }
    fetchCategories()
    return () => {
      mounted = false
    }
  }, [])

  // Ambil daftar paket sesuai filter (menggunakan paramsString)
  const fetchPackages = useCallback(
    async (ps = paramsString) => {
      setLoading(true)
      const sp = new URLSearchParams(ps)
      const params = new URLSearchParams()

      const currentSearch = sp.get('search') || ''
      const currentLoc = sp.get('location') || ''
      const currentMinPrice = Number(sp.get('minPrice')) || 0
      const currentMaxPrice = Number(sp.get('maxPrice')) || 10000000
      const currentCategory = sp.get('category') || ''
      const sort = sp.get('sort') || ''

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
          console.warn('Gagal memuat paket (status not ok)')
          setPackages([])
        }
      } catch (error) {
        console.error('Error fetching packages:', error)
        setPackages([])
      } finally {
        setLoading(false)
      }
    },
    [paramsString]
  )

  // Sync local state dari query params dan fetch
  useEffect(() => {
    const sp = new URLSearchParams(paramsString)
    setSearch(sp.get('search') || '')
    setLocation(sp.get('location') || '')
    setMinPrice(Number(sp.get('minPrice')) || 0)
    setMaxPrice(Number(sp.get('maxPrice')) || 10000000)
    setSelectedCategory(sp.get('category') || '')
    // ambil paket sesuai paramsString terkini
    fetchPackages(paramsString)
  }, [paramsString, fetchPackages])

  const handleFilter = () => {
    const params = new URLSearchParams()

    if (search) params.set('search', search)
    else params.delete('search')

    if (location) params.set('location', location)
    else params.delete('location')

    params.set('minPrice', minPrice.toString())
    params.set('maxPrice', maxPrice.toString())

    if (selectedCategory) params.set('category', selectedCategory)
    else params.delete('category')

    const sp = new URLSearchParams(paramsString)
    const currentSort = sp.get('sort')
    if (currentSort) {
      params.set('sort', currentSort)
    } else {
      params.delete('sort')
    }

    router.push(`/packages?${params.toString()}`)
  }

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    setSelectedCategory(value)

    const params = new URLSearchParams(paramsString)

    if (value) params.set('category', value)
    else params.delete('category')

    if (search) params.set('search', search)
    else params.delete('search')

    if (location) params.set('location', location)
    else params.delete('location')

    params.set('minPrice', minPrice.toString())
    params.set('maxPrice', maxPrice.toString())

    const currentSort = new URLSearchParams(paramsString).get('sort')
    if (currentSort) params.set('sort', currentSort)
    else params.delete('sort')

    router.push(`/packages?${params.toString()}`)
  }

  return (
    <>
      {/* search & filter */}
      <section className="pt-10 pb-5 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              <span className="bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent dark:from-white dark:to-blue-200">
                Cari Paket Wisata
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Impianmu
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Gunakan filter pencarian yang cerdas untuk menemukan paket wisata
              yang sesuai dengan preferensi dan budget Anda.{' '}
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                Temukan petualangan sempurna!
              </span>
            </p>
          </div>

          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/20 p-8 transform hover:scale-[1.02] transition-all duration-500">
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
                <div className="lg:col-span-2 space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                    <Search className="h-4 w-4 text-blue-500" />
                    Kata Kunci
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Cari destinasi atau paket..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-4 pr-10 h-12 border-2 border-gray-200 focus:border-blue-500 dark:border-gray-700 dark:focus:border-blue-400 transition-colors w-full"
                    />
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </div>

                <div className="lg:col-span-2 space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-green-500" />
                    Lokasi Tujuan
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Bandung..."
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="pl-4 pr-10 h-12 border-2 border-gray-200 focus:border-blue-500 dark:border-gray-700 dark:focus:border-blue-400 transition-colors w-full"
                    />
                    <Map className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </div>

                <div className="lg:col-span-2 space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                    <Filter className="h-4 w-4 text-purple-500" />
                    Kategori
                  </label>
                  <select
                    className="pl-4 pr-10 h-12 border-2 border-gray-200 focus:border-blue-500 dark:border-gray-700 dark:focus:border-blue-400 transition-colors w-full"
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                  >
                    <option value="">Semua Kategori</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="my-6 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-500" />
                    Rentang Harga
                  </label>
                  <div className="text-sm font-medium text-blue-600">
                    {formatRupiah(minPrice)} - {formatRupiah(maxPrice)}
                  </div>
                </div>
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
                  className="w-full"
                />
              </div>

              <div className="flex justify-center">
                <button
                  onClick={handleFilter}
                  className="h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center p-5 rounded"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Cari Paket
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Daftar Paket */}
      <section className="py-24 bg-gradient-to-b from-white to-blue-50/30 dark:from-background dark:to-blue-950/30">
        <div className="container mx-auto px-4">
          <div className="flex justify-between mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent dark:from-white dark:to-blue-200">
              Paket Travel Tersedia
            </h1>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 items-center mr-2">
                Sort :
              </label>
              <select
                value={new URLSearchParams(paramsString).get('sort') || ''}
                onChange={(e) => {
                  const params = new URLSearchParams(paramsString)
                  const value = e.target.value

                  if (value) {
                    params.set('sort', value)
                  } else {
                    params.delete('sort')
                  }

                  router.push(`/packages?${params.toString()}`)
                }}
                className="px-3 py-2 rounded pl-4 pr-10 h-12 border-2 border-gray-200 focus:border-blue-500 dark:border-gray-700 dark:focus:border-blue-400 transition-colors"
              >
                <option value="">Default</option>
                <option value="price_asc">Harga Termurah</option>
                <option value="price_desc">Harga Termahal</option>
                <option value="newest">Terbaru</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              <p>Memuat paket...</p>
            ) : packages.length > 0 ? (
              packages.map((pkg) => (
                <div
                  key={pkg._id}
                  className="transform hover:scale-105 transition-all duration-500"
                  style={{ animation: 'fadeInUp 0.6s ease-out forwards' }}
                >
                  <PackageCard pkg={pkg} />
                </div>
              ))
            ) : (
              <p>Tidak ada paket tersedia saat ini.</p>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
