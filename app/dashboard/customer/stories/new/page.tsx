'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { toast } from 'react-toastify'
import { CldUploadWidget } from 'next-cloudinary'

interface BookingPackage {
  _id: string
  title: string
}

const AddStories = () => {
    const { data: session } = useSession()
    const router = useRouter()

    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [selectedPackage, setSelectedPackage] = useState('')
    const [media, setMedia] = useState<string[]>([])
    const [packages, setPackages] = useState<BookingPackage[]>([])
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        if (!session?.user) return

        const fetchBookings = async () => {
        try {
            const res = await fetch('/api/bookings/customer')
            const allBookings = await res.json()
            const confirmed = allBookings.filter((b: any) =>
            b.status === "confirmed" && b.packageId && !b.hasStory
            )
            setPackages(
            confirmed.map((b: any) => ({
                _id: b.packageId._id,
                title: b.packageId.title,
            }))
            )
        } catch (err) {
            toast.error("Gagal memuat paket")
        }
        }

        fetchBookings()
    }, [session?.user])

    const handleUpload = (result: any) => {
        setMedia((prev) => [...prev, result.info.secure_url])
    }

    const handleSubmit = async () => {
        if (!title || !content || !selectedPackage) {
        toast.error('Semua field wajib diisi')
        return
        }

        setSubmitting(true)

        try {
        const res = await fetch('/api/stories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
            packageId: selectedPackage,
            title,
            content,
            media,
            }),
        })

        if (res.ok) {
            toast.success('Cerita berhasil dibuat!')
            router.push('/dashboard/customer')
        } else {
            toast.error('Gagal menyimpan cerita')
        }
        } finally {
        setSubmitting(false)
        }
    }

  return (
    <div className="max-w-3xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Buat Cerita Perjalanan</h1>

      <label className="block mb-2 font-medium">Judul Cerita</label>
      <Input value={title} onChange={(e) => setTitle(e.target.value)} />

      <label className="block mt-4 mb-2 font-medium">Pilih Paket</label>
      <select
        value={selectedPackage}
        onChange={(e) => setSelectedPackage(e.target.value)}
        className="w-full border rounded p-2"
      >
        <option value="">-- Pilih Paket --</option>
        {packages.map((pkg) => (
          <option key={pkg._id} value={pkg._id}>
            {pkg.title}
          </option>
        ))}
      </select>

      <label className="block mt-4 mb-2 font-medium">Isi Cerita</label>
      <Textarea rows={6} value={content} onChange={(e) => setContent(e.target.value)} />

      <label className="block mt-4 mb-2 font-medium">Upload Foto/Video (Opsional)</label>
      <CldUploadWidget uploadPreset="recipe_upload" onSuccess={handleUpload}>
        {({ open }) => (
          <Button type="button" onClick={() => open()}>
            Upload Media
          </Button>
        )}
      </CldUploadWidget>

      {media.length > 0 && (
        <div className="mt-4 space-y-2">
          {media.map((url, idx) => (
            <div key={idx}>
              <img src={url} alt={`Media ${idx}`} className="max-w-xs rounded" />
            </div>
          ))}
        </div>
      )}

      <Button onClick={handleSubmit} disabled={submitting} className="mt-6 w-full">
        {submitting ? 'Menyimpan...' : 'Simpan Cerita'}
      </Button>
    </div>
  )
}

export default AddStories