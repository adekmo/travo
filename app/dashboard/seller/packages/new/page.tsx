'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { CldUploadWidget } from 'next-cloudinary'
import { useSession } from 'next-auth/react'
import { Category } from '@/types/category'
import DynamicInputList from '@/components/form/DynamicInputList'
import ItineraryEditor from '@/components/form/ItineraryEditor'
import FacilitiesInputList from '@/components/form/FacilitiesInputList'
import Image from 'next/image'


const CreatePackagePage = () => {
  const { data: session, status } = useSession()

     const [form, setForm] = useState({
        title: '',
        description: '',
        price: '',
        // date: '',
        location: '',
        image: '',
        category: '',
        duration: "",
        maxPeople: 1,
        highlights: [""],
        included: [""],
        excluded: [""],
        facilities: [{ name: "", icon: "" }], 
        itinerary: [
          {
            day: 1,
            title: "",
            activities: [""],
            meals: "",
            accommodation: ""
          }
        ]
    })
    const [loading, setLoading] = useState(false)
    // const [checking, setChecking] = useState(true)
    const [isVerified, setIsVerified] = useState(false)
    const [categories, setCategories] = useState<Category[]>([]);

    const router = useRouter()

    useEffect(() => {
      const fetchCategoriesData = async () => {
        try {
          const res = await fetch('/api/categories'); // Panggil API GET Categories (publik)
          if (!res.ok) {
            throw new Error('Gagal memuat daftar kategori.');
          }
          const data = await res.json();
          setCategories(data);
        } catch (error) {
          console.error('Error fetching categories:', error);
          alert('Gagal memuat kategori: ' + (error as Error).message); // Tampilkan pesan error ke user
        }
      };
      fetchCategoriesData();
    }, []);

    useEffect(() => {
      if (status === 'loading') return

      // Cek verifikasi dari session
      if (session?.user.role === 'seller') {
        setIsVerified(session.user.isVerified) // Dapatkan status verifikasi dari session
        // setChecking(false)
      } else {
        router.push('/dashboard/seller/packages') // Jika bukan seller, redirect
      }
    }, [session, status, router])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setForm((prev) => ({
        ...prev,
        [name]: value,
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const cleanFacilities = form.facilities.map((f) => ({
          name: f.name,
          icon: f.icon ?? '', // ubah undefined jadi string kosong
        }))

        const res = await fetch('/api/seller/packages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            ...form,
            facilities: cleanFacilities,
        }),
        })

        if (res.ok) {
        router.push('/dashboard/seller/packages')
        } else {
        alert('Gagal menambahkan paket')
        }

        setLoading(false)
    }

    if (!isVerified) {
      return (
        <div className="max-w-xl mx-auto p-6 text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-600">Akses Ditolak</h1>
          <p className="text-gray-700">
            Anda belum diverifikasi sebagai seller. Silakan hubungi admin untuk verifikasi akun Anda sebelum bisa mengunggah paket.
          </p>
        </div>
      )
    }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Tambah Paket Travel</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          type="text"
          placeholder="Judul Paket"
          value={form.title}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <textarea
          name="description"
          placeholder="Deskripsi"
          value={form.description}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          name="price"
          type="number"
          placeholder="Harga"
          value={form.price}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
        {/* <input
          name="date"
          type="date"
          placeholder="Tanggal"
          value={form.date}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        /> */}
        <input
          name="location"
          type="text"
          placeholder="Lokasi"
          value={form.location}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          name="duration"
          type="text"
          placeholder="Contoh: 2 hari 3 malam"
          value={form.duration}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          name="maxPeople"
          type="number"
          placeholder="Maksimal Peserta"
          value={form.maxPeople}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />

        <div>
          <label className="block mb-2 font-semibold">Kategori</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          >
            <option value="">Pilih Kategori</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Highlight */}
        <DynamicInputList
          label="Highlight Perjalanan"
          values={form.highlights}
          onChange={(vals) => setForm({ ...form, highlights: vals })}
        />

        {/* included */}
        <DynamicInputList
          label="Included"
          values={form.included}
          onChange={(vals) => setForm({ ...form, included: vals })}
        />

        {/* excluded */}
        <DynamicInputList
          label="Excluded"
          values={form.excluded}
          onChange={(vals) => setForm({ ...form, excluded: vals })}
        />

        {/* facilities */}
        <FacilitiesInputList
          facilities={form.facilities}
          onChange={(updated) => setForm({ ...form, facilities: updated })}
        />

        {/* itinerary */}
        <ItineraryEditor
          itinerary={form.itinerary}
          onChange={(updated) => setForm({ ...form, itinerary: updated })}
        />

        <div>
          <label className="block mb-2 font-medium">Upload Gambar</label>
            <CldUploadWidget
              uploadPreset="recipe_upload" 
              onSuccess={(result) => {
                const info = result.info as { secure_url?: string }
                if (info?.secure_url) {
                  setForm((prev) => ({
                    ...prev,
                    image: info.secure_url!,
                  }))
                }
              }}
            >
              {({ open }) => (
                <button
                  type="button"
                  onClick={() => open()}
                  className="bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300"
                >
                  Upload Gambar
                </button>
              )}
            </CldUploadWidget>

            {form.image && (
              // <img src={form.image} alt="Preview" className="w-40 h-auto mt-2 rounded" />
              <Image src={form.image} alt="Preview" className="w-40 h-auto mt-2 rounded" />
            )}
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Menyimpan...' : 'Simpan Paket'}
        </button>
      </form>
    </div>
  )
}

export default CreatePackagePage