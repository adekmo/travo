// app/dashboard/admin/stories/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Story } from '@/types/story'


const AdminStoriesPage = () => {
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStories = async () => {
      const res = await fetch('/api/admin/stories')
      if (res.ok) {
        const data = await res.json()
        setStories(data)
      }
      setLoading(false)
    }

    fetchStories()
  }, [])

  if (loading) return <div className="p-6">Memuat cerita...</div>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Daftar Semua Cerita</h1>
      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="px-4 py-2 text-left">Judul</th>
              <th className="px-4 py-2 text-left">Penulis</th>
              <th className="px-4 py-2 text-left">Paket</th>
              <th className="px-4 py-2">Tanggal</th>
              <th className="px-4 py-2">Like</th>
              <th className="px-4 py-2">Komentar</th>
              <th className="px-4 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {stories.map((story) => (
              <tr key={story._id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2 font-medium">{story.title}</td>
                <td className="px-4 py-2">{story.userId?.name}</td>
                <td className="px-4 py-2">{story.packageId?.title}</td>
                <td className="px-4 py-2 text-center">{format(new Date(story.createdAt), 'dd MMM yyyy', { locale: id })}</td>
                <td className="px-4 py-2 text-center">{story.likes?.length || 0}</td>
                <td className="px-4 py-2 text-center">{story.commentCount ?? 0}</td>
                <td className="px-4 py-2 text-center">
                  <Link href={`/stories/${story._id}`}>
                    <Button size="sm" variant="outline">Lihat</Button>
                  </Link>
                </td>
              </tr>
            ))}
            {stories.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-4 text-center text-gray-500">Tidak ada cerita ditemukan</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminStoriesPage
