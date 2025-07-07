'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import PackageCard from '@/components/PackageCard'
import { TravelPackage } from '@/types/travelPackage'

import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import { Category } from '@/types/category'
import { Badge, Filter, MapPin, Search, Shield } from 'lucide-react'
import Features from '@/components/Features'
import Footer from '@/components/Footer'

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
      <section className="relative bg-gradient-to-r from-primary/10 via-primary/5 to-background">
        <div className="container mx-auto px-4 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <Badge className="bg-primary/10 text-primary border-primary/20" />
                Platform Travel Terpercaya #1 di Indonesia
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                Temukan dan Booking
                <span className="text-primary block">
                  Paket Wisata Favoritmu!
                </span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg">
                Jelajahi destinasi eksotis Indonesia dengan paket wisata
                terlengkap. Booking mudah, harga terjangkau, dan pelayanan
                terbaik.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="text-white bg-blue-500 rounded p-4">
                  Mulai Jelajahi
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">50K+</div>
                  <div className="text-sm text-muted-foreground">Wisatawan</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">200+</div>
                  <div className="text-sm text-muted-foreground">Destinasi</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">4.9</div>
                  <div className="text-sm text-muted-foreground">Rating</div>
                </div>
              </div>
            </div>

            {/* Right Content - Hero Image */}
            <div className="relative">
              <div className="aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&h=450&fit=crop"
                  alt="Beautiful Indonesian destination"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Floating Cards */}
              <div className="absolute -bottom-6 -left-6 p-4 bg-white shadow-xl border-0">
                <div className="p-0 flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <Shield className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">100% Aman</div>
                    <div className="text-xs text-muted-foreground">
                      Terjamin & Terpercaya
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
        {/* search & filter */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Cari Paket Wisata Impianmu
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Gunakan filter pencarian untuk menemukan paket wisata yang sesuai
              dengan preferensi dan budget Anda.
            </p>
          </div>
          {/* <SearchFilters /> */}
          <div className='rounded-lg border bg-card text-card-foreground shadow-sm w-full max-w-4xl mx-auto'>
            <div className='p-6'>
                <div className='flex justify-between'>
                    <div>
                        <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2"><Search className="h-4 w-4" />Kata Kunci</label>
                        <input
                            type="text"
                            placeholder="Cari destinasi atau nama paket..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="border px-3 py-2 rounded w-full mb-4"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2"><MapPin className="h-4 w-4" />Lokasi Tujuan</label>
                        <input
                            type="text"
                            placeholder="Bandung..."
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="border px-3 py-2 rounded w-full mb-4"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        Kategori
                        </label>
                        <select
                        className="border px-3 py-2 rounded mb-4"
                        value={selectedCategory} // <<< Pastikan ini mengikat ke `selectedCategory` state
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
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
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
                <div className='flex justify-center'> 
                        <button
                            onClick={handleFilter}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-6 flex items-center gap-2"
                        >
                            <Search className="h-4 w-4 mr-2" />
                            Cari Paket
                        </button>
                </div>
            </div>
          </div>
        </div>
      </section>

      <div className='flex justify-between'>
        <h1 className="text-3xl font-bold mb-6">Paket Travel Tersedia</h1>
        <div>
                    <label className="text-sm font-medium text-foreground mb-2 items-center mr-2">
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
                    className="border px-3 py-2 rounded"
                    >
                    <option value="">Default</option>
                    <option value="price_asc">Harga Termurah</option>
                    <option value="price_desc">Harga Termahal</option>
                    <option value="newest">Terbaru</option>
                    </select>
                </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <p>Memuat paket...</p>
        ) : packages.length > 0 ? (
          packages.map((pkg) => <PackageCard key={pkg._id} pkg={pkg} />)
        ) : (
          <p>Tidak ada paket tersedia saat ini.</p>
        )}
      </div>

      <Features />
      <Footer />
    </div>
  )
}
