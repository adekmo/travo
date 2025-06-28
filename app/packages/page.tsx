'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import PackageCard from '@/components/PackageCard'
import { TravelPackage } from '@/types/travelPackage'

import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import { Category } from '@/types/category'

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
    const currentCategory = searchParams.get('category') || ''; // <<< Pastikan kategori diambil dari URL

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
    } catch (error: any) { // Tangkap error untuk pesan yang lebih informatif
      console.error('Error fetching packages:', error);
      alert(`Gagal memuat paket: ${error.message || 'Terjadi kesalahan.'}`);
      setPackages([]); // Kosongkan daftar paket jika terjadi error
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
    setSelectedCategory(searchParams.get('category') || ''); // <<< Sinkronkan selectedCategory dari URL

    fetchPackages(); // Panggil fetchPackages setelah state disinkronkan
  }, [searchParams.toString()]);

  const handleFilter = () => {
    const params = new URLSearchParams()
    // --- PERBAIKAN 3: `handleFilter` harus membaca semua filter dari state lokal terbaru ---
    if (search) params.set('search', search)
    else params.delete('search')

    if (location) params.set('location', location)
    else params.delete('location')

    params.set('minPrice', minPrice.toString())
    params.set('maxPrice', maxPrice.toString())

    // Tambahkan selectedCategory dari state lokal
    if (selectedCategory) params.set('category', selectedCategory)
    else params.delete('category')
    // --- AKHIR PERBAIKAN 3 ---

    // Pertahankan parameter sort yang sudah ada di URL
    const currentSort = searchParams.get('sort')
    if (currentSort) {
      params.set('sort', currentSort)
    } else {
      params.delete('sort')
    }

    router.push(`/packages?${params.toString()}`)
  }

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value; // Ambil nilai kategori yang dipilih (ID)
    setSelectedCategory(value); // <<< UNCOMMENT BARIS INI: Update state `selectedCategory` di sini

    const params = new URLSearchParams(searchParams.toString()); // Mulai dengan params URL yang ada
    
    // Perbarui atau hapus parameter 'category'
    if (value) {
      params.set('category', value);
    } else {
      params.delete('category');
    }

    // Pastikan filter lain yang sudah ada di state lokal juga ikut terkirim ke URL
    if (search) params.set('search', search); else params.delete('search');
    if (location) params.set('location', location); else params.delete('location');
    params.set('minPrice', minPrice.toString());
    params.set('maxPrice', maxPrice.toString());

    // Pertahankan sort parameter
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

      <div className="mb-2">
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

      <div className='mb-5'>
        <label className="block mb-1 font-medium">Filter Kategori</label>
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
