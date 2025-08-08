'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { toast } from 'react-toastify'
import { CldUploadWidget, CloudinaryUploadWidgetResults } from 'next-cloudinary'
import { Save, Tag, X } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import Image from 'next/image'

interface BookingPackage {
  _id: string
  title: string
}

type BookingWithPackage = {
  packageId: {
    _id: string;
    title: string;
  };
};

const AddStories = () => {
    const { data: session } = useSession()
    const router = useRouter()

    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [selectedPackage, setSelectedPackage] = useState('')
    const [media, setMedia] = useState<string[]>([])
    const [tags, setTags] = useState<string[]>([])
    const [tagInput, setTagInput] = useState("")
    const [packages, setPackages] = useState<BookingPackage[]>([])
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        if (!session?.user) return

        const fetchBookings = async () => {
        try {
            const res = await fetch('/api/bookings/customer')
            const allBookings = await res.json()
            const confirmed = allBookings.filter((b: {
              status: string;
              packageId: { _id: string; title: string };
              hasStory: boolean;
            }) => b.status === "confirmed" && b.packageId && !b.hasStory)

            setPackages(
              confirmed.map((b: BookingWithPackage) => ({
                _id: b.packageId._id,
                title: b.packageId.title,
              }))
            );
        } catch {
            toast.error("Gagal memuat paket")
        }
        }

        fetchBookings()
    }, [session?.user])

    const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" || e.key === ",") {
        e.preventDefault()
        const newTag = tagInput.trim()
        if (newTag && !tags.includes(newTag)) {
          setTags([...tags, newTag])
          setTagInput("")
        }
      }
    }

    const removeTag = (index: number) => {
      setTags(tags.filter((_, i) => i !== index))
    }

    const handleUpload = (result: CloudinaryUploadWidgetResults) => {
      const info = result?.info;
      if (typeof info === 'object' && info && 'secure_url' in info) {
        const url = (info as { secure_url: string }).secure_url;
        if (typeof url === 'string') {
          setMedia((prev): string[] => [...prev, url]);
        }
      }
};

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
            tags
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

      <div className='mb-10'>
        <label className="block mt-4 mb-2 font-medium">Isi Cerita</label>
        <Textarea rows={6} value={content} onChange={(e) => setContent(e.target.value)} />
      </div>

      <Card >
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
              <Tag className="h-5 w-5" />
              Tag & Topik
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag, index) => (
                      <Badge
                        key={tag}
                        variant="default"
                        className="bg-blue-600 text-white"
                      >
                        #{tag}
                        <button type="button" onClick={() => removeTag(index)} className="ml-1 hover:bg-blue-700 rounded-full">
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                  ))}
                </div>
              )}
              <div>
                <label className="block mt-4 mb-2 font-medium">Tambah Tag</label>
                <Input
                  placeholder="Masukkan tag (contoh: pantai, kuliner)"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                />
              </div>
          </div>
        </CardContent>
      </Card>
        
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
              {/* <img src={url} alt={`Media ${idx}`} className="max-w-xs rounded" /> */}
              <Image
                src={url}
                alt={`Media ${idx}`}
                width={400} // atau ukuran sesuai kebutuhanmu
                height={300}
                className="max-w-xs rounded"
              />
            </div>
          ))}
        </div>
      )}

      <Button onClick={handleSubmit} disabled={submitting} className="mt-6 w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
        <Save className="h-4 w-4 mr-2" />
        {submitting ? 'Menyimpan...' : 'Simpan Cerita'}
      </Button>
    </div>
  )
}

export default AddStories