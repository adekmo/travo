'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const CreatePackagePage = () => {
     const [form, setForm] = useState({
        title: '',
        description: '',
        price: '',
        date: '',
        location: '',
    })
    const [loading, setLoading] = useState(false)

    const router = useRouter()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setForm((prev) => ({
        ...prev,
        [name]: value,
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const res = await fetch('/api/seller/packages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            ...form
        }),
        })

        if (res.ok) {
        router.push('/dashboard/seller/packages')
        } else {
        alert('Gagal menambahkan paket')
        }

        setLoading(false)
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
        <input
          name="date"
          type="date"
          placeholder="Tanggal"
          value={form.date}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          name="location"
          type="text"
          placeholder="Lokasi"
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
          {loading ? 'Menyimpan...' : 'Simpan Paket'}
        </button>
      </form>
    </div>
  )
}

export default CreatePackagePage