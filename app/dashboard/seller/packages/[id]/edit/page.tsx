'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { TravelPackage } from '@/types/travelPackage'

import { CldUploadWidget } from 'next-cloudinary'
import { Category } from '@/types/category'
import DynamicInputList from '@/components/form/DynamicInputList'
import FacilitiesInputList from '@/components/form/FacilitiesInputList'
import ItineraryEditor from '@/components/form/ItineraryEditor'

type Params = { id: string }

const EditPackagePage = ({ params }: { params: Promise<Params> }) => {

    const { id } = use(params)
    const [categories, setCategories] = useState<Category[]>([]);
    const [form, setForm] = useState<TravelPackage>({
        _id: '',
        title: '',
        description: '',
        price: 0,
        // date: '',
        location: '',
        image: '',
        seller: {
           _id: '',
            name: '',
            email: '',
            role: 'seller',
            isVerified: false,
            isBlocked: false,
            phone: '',
            address: '',
        },
        category: {
          _id: '',
          name: '',
        },
        duration: '',
        maxPeople: 0,
        highlights: [],
        included: [],
        excluded: [],
        facilities: [{ name: '', icon: '' }],
        itinerary: []
    })
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const fetchCategories = async () => {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data);
    };

    useEffect(() => {
        const fetchPackage = async () => {
        const res = await fetch(`/api/seller/packages/${id}`)
        if (res.ok) {
            const data = await res.json()
            setForm({
            ...data,
            facilities: data.facilities?.map((f: any) => ({
              name: f.name,
              icon: f.icon ?? '',
            })) ?? [],
            itinerary: data.itinerary?.map((item: any) => ({
              day: item.day,
              title: item.title,
              activities: item.activities ?? [],
              meals: item.meals ?? '',
              accommodation: item.accommodation ?? ''
            })) ?? []
          })
        } else {
            alert('Data paket tidak ditemukan')
        }
        }

        fetchCategories()
        fetchPackage()
    }, [id])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setForm((prev) => ({
        ...prev,
        [name]: name === 'price' ? Number(value) : value,
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        const cleanData = {
          ...form,
          facilities: form.facilities.map((f) => ({
            name: f.name,
            icon: f.icon ?? '',
          })),
        }

        const res = await fetch(`/api/seller/packages/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanData),
        })

        if (res.ok) {
        router.push('/dashboard/seller/packages') // Redirect ke halaman daftar paket setelah berhasil update
        } else {
        alert('Gagal memperbarui paket')
        }

        setLoading(false)
    }
  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Paket Travel</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Judul Paket"
          name="title"
          value={form.title}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <textarea
          placeholder="Deskripsi"
          name="description"
          value={form.description}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          type="number"
          placeholder="Harga"
          name="price"
          value={form.price}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
        {/* <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        /> */}
        <input
          type="text"
          placeholder="Lokasi"
          name="location"
          value={form.location}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />

        <div>
          <label className="block font-medium mb-1">Kategori</label>
          <select
            name="category"
            value={form.category?._id}
            onChange={(e) => {
              const selectedId = e.target.value;
              const selectedCategory = categories.find((cat) => cat._id === selectedId);
              if (selectedCategory) {
                setForm((prev) => ({
                  ...prev,
                  category: {
                    _id: selectedCategory._id,
                    name: selectedCategory.name,
                  },
                }));
              }
            }}
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

        <input
          type="text"
          name="duration"
          placeholder="Contoh: 2 hari 3 malam"
          value={form.duration}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="number"
          name="maxPeople"
          placeholder="Maksimum Peserta"
          value={form.maxPeople}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
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
            uploadPreset="recipe_upload" // Ganti sesuai preset Cloudinary kamu
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
                className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
              >
                Pilih Gambar
              </button>
            )}
          </CldUploadWidget>

          {form.image && (
            <img
              src={form.image}
              alt="Preview Gambar"
              className="mt-4 rounded w-full max-h-64 object-cover"
            />
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </form>
    </div>
  )
}

export default EditPackagePage