'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import PackageCard from '@/components/PackageCard'
import { TravelPackage } from '@/types/travelPackage'

import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import { Category } from '@/types/category'
import { Badge, Calendar, DollarSign, Filter, Map, MapPin, Search, Shield } from 'lucide-react'
import Features from '@/components/Features'
import Footer from '@/components/Footer'
import Hero from '@/components/Hero'
import FeaturedStory from '@/components/FeaturedStory'

const formatRupiah = (value: number) => `Rp${new Intl.NumberFormat('id-ID').format(value)}`

export default function PackagesPage() {

  const router = useRouter()
  const searchParams = useSearchParams()

  const [packages, setPackages] = useState<TravelPackage[]>([])
  const [loading, setLoading] = useState(false)

  const [search, setSearch] = useState('')
  const [location, setLocation] = useState('')
  const [minPrice, setMinPrice] = useState<number>(0)
  const [maxPrice, setMaxPrice] = useState<number>(10000000)
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '')
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data);
    }
    fetchCategories();
  }, []);
  
  const fetchPackages = async () => {
    setLoading(true)
    const params = new URLSearchParams()

    // Ambil semua filter dari `searchParams` yang merupakan representasi URL terkini
    const currentSearch = searchParams.get('search') || '';
    const currentLoc = searchParams.get('location') || '';
    const currentMinPrice = Number(searchParams.get('minPrice')) || 0;
    const currentMaxPrice = Number(searchParams.get('maxPrice')) || 10000000;
    const currentCategory = searchParams.get('category') || ''; 

    if (currentSearch) params.set('search', currentSearch);
    if (currentLoc) params.set('location', currentLoc);
    if (currentMinPrice) params.set('minPrice', currentMinPrice.toString());
    if (currentMaxPrice) params.set('maxPrice', currentMaxPrice.toString());
    if (currentCategory) params.set('category', currentCategory); // <<< Tambahkan kategori ke params

    const sort = searchParams.get('sort') || '';
    if (sort) params.set('sort', sort);

    try {
      const res = await fetch(`/api/packages?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setPackages(data);
      } else {
        alert('Gagal memuat paket');
      }
    } catch (error: any) { 
      console.error('Error fetching packages:', error);
      alert(`Gagal memuat paket: ${error.message || 'Terjadi kesalahan.'}`);
      setPackages([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Sinkronkan state lokal dengan nilai dari URL saat `searchParams` berubah
    setSearch(searchParams.get('search') || '');
    setLocation(searchParams.get('location') || '');
    setMinPrice(Number(searchParams.get('minPrice')) || 0);
    setMaxPrice(Number(searchParams.get('maxPrice')) || 10000000);
    setSelectedCategory(searchParams.get('category') || ''); //

    fetchPackages();
  }, [searchParams.toString()]);

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

    const currentSort = searchParams.get('sort')
    if (currentSort) {
      params.set('sort', currentSort)
    } else {
      params.delete('sort')
    }

    router.push(`/packages?${params.toString()}`)
  }

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedCategory(value);

    const params = new URLSearchParams(searchParams.toString());
    
    if (value) {
      params.set('category', value);
    } else {
      params.delete('category');
    }

    if (search) params.set('search', search); else params.delete('search');
    if (location) params.set('location', location); else params.delete('location');
    params.set('minPrice', minPrice.toString());
    params.set('maxPrice', maxPrice.toString());

    const currentSort = searchParams.get('sort');
    if (currentSort) {
      params.set('sort', currentSort);
    } else {
      params.delete('sort');
    }

    router.push(`/packages?${params.toString()}`); // Push perubahan ke URL
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Hero */}
      <Hero />

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
              yang sesuai dengan preferensi dan budget Anda.{" "}
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                Temukan petualangan sempurna!
              </span>
            </p>
          </div>
          {/* <SearchFilters /> */}
          <div className='bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/20 p-8 transform hover:scale-[1.02] transition-all duration-500'>
            <div className='p-6'>
                <div className='grid grid-cols-1 lg:grid-cols-6 gap-6'>
                    <div className='lg:col-span-2 space-y-2'>
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2"><Search className="h-4 w-4 text-blue-500" />Kata Kunci</label>
                        <div className='relative'>
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
                    <div className='lg:col-span-2 space-y-2'>
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2"><MapPin className="h-4 w-4 text-green-500" />Lokasi Tujuan</label>
                        <div className='relative'>
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
                    <div className='lg:col-span-2 space-y-2'>
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
                    {/* Durasi */}
                    {/* <div className='lg:col-span-2 space-y-2'>
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-orange-500" />
                        Durasi
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
                    </div> */}
                </div>
                <div className="my-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-500" />
                      Rentang Harga
                    </label>
                    <div className="text-sm font-medium text-blue-600">
                      Rentang Harga: {formatRupiah(minPrice)} - {formatRupiah(maxPrice)}
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
                <div className='flex justify-center'> 
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

      <section className="py-24 bg-gradient-to-b from-white to-blue-50/30 dark:from-background dark:to-blue-950/30">
        <div className='containet mx-auto px-4'>
          <div className='text-center mb-10'>
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 text-orange-700 dark:text-orange-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
              🔥 Trending Sekarang
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-gray-900 to-purple-800 bg-clip-text text-transparent dark:from-white dark:to-purple-200">
                Paket Wisata
              </span>
              <br />
              <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                Terpopuler
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
              Destinasi favorit pilihan ribuan wisatawan dengan rating terbaik
              dan ulasan terpercaya
            </p>
          </div>

          {/* Card */}
          <div className='flex justify-between'>
            <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent dark:from-white dark:to-blue-200">Paket Travel Tersedia</h1>
            <div>
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 items-center mr-2">
                            Sort :
                        </label>
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
                        className="px-3 py-2 rounded pl-4 pr-10 h-12 border-2 border-gray-200 focus:border-blue-500 dark:border-gray-700 dark:focus:border-blue-400 transition-colors"
                        >
                        <option value="">Default</option>
                        <option value="price_asc">Harga Termurah</option>
                        <option value="price_desc">Harga Termahal</option>
                        <option value="newest">Terbaru</option>
                        </select>
                    </div>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {loading ? (
              <p>Memuat paket...</p>
            ) : packages.length > 0 ? (
              packages.map((pkg) => <div key={pkg._id} className="transform hover:scale-105 transition-all duration-500"
                style={{
                  animation: "fadeInUp 0.6s ease-out forwards",}}>
                <PackageCard pkg={pkg} />
              </div>)
            ) : (
              <p>Tidak ada paket tersedia saat ini.</p>
            )}
          </div>
        </div>
      </section>

      {/* Featured Stories */}
      <FeaturedStory />

      <Features />
      <Footer />
    </div>
  )
}
