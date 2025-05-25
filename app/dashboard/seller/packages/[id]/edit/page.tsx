'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { TravelPackage } from '@/types/travelPackage'

type Params = { id: string }

const EditPackagePage = ({ params }: { params: Promise<Params> }) => {

    const { id } = use(params)
    const [form, setForm] = useState<TravelPackage>({
        title: '',
        description: '',
        price: 0,
        date: '',
        location: '',
    })
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const fetchPackage = async () => {
        const res = await fetch(`/api/seller/packages/${id}`)
        if (res.ok) {
            const data = await res.json()
            setForm(data)
        } else {
            alert('Data paket tidak ditemukan')
        }
        }

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

        const res = await fetch(`/api/seller/packages/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
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
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Lokasi"
          name="location"
          value={form.location}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />

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