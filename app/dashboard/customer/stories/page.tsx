'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
// import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/Button'
import { Story } from '@/types/story'
import Image from 'next/image'


const MyStoriesPage = () => {
  const [stories, setStories] = useState<Story[]>([])
  // const { data: session } = useSession()

  useEffect(() => {
    const fetchStories = async () => {
      const res = await fetch('/api/stories/customer')
      if (res.ok) {
        const data = await res.json()
        setStories(data)
      }
    }
    fetchStories()
  }, [])

  return (
    <div className="max-w-4xl mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Cerita Saya</h1>
        <Link href="/dashboard/customer/stories/new">
          <Button>+ Tulis Cerita</Button>
        </Link>
      </div>

      {stories.length === 0 ? (
        <p>Belum ada cerita yang ditulis.</p>
      ) : (
        <ul className="space-y-4">
          {stories.map((story) => (
            <li key={story._id} className="border rounded p-4 shadow-sm">
             {Array.isArray(story.media) && story.media.length > 0 && (
                <Image 
                  src={story.media[0]}
                  alt="cover"
                  className="w-full max-h-48 object-cover rounded mb-2"
                />
              )}
              <h2 className="text-xl font-semibold">{story.title}</h2>
              <p className="text-sm text-gray-600">
                {new Date(story.createdAt).toLocaleDateString()} | Paket: {story.packageId?.title}
              </p>
              <div className="mt-2 flex gap-3">
                {/* Tombol edit/hapus nanti */}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default MyStoriesPage
