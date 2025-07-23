'use client'

import { useEffect, useState } from "react"
import Link from "next/link"
import { Story } from "@/types/story"

const StoriesPage = () => {
    const [stories, setStories] = useState<Story[]>([])

    useEffect(() => {
        const fetchStories = async () => {
            const res = await fetch('/api/stories')
            const data = await res.json()
            setStories(data)
        }
        fetchStories()
    }, [])
  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Cerita Perjalanan</h1>

      {stories.length === 0 ? (
        <p className="text-gray-600">Belum ada cerita perjalanan.</p>
      ) : (
        <div className="space-y-6">
          {stories.map((story) => (
            <div key={story._id} className="border rounded p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                {story.userId?.image && (
                  <img src={story.userId.image} alt="user" className="w-8 h-8 rounded-full" />
                )}
                <span className="font-semibold">{story.userId?.name || "Pengguna"}</span>
              </div>

              <Link href={`/stories/${story._id}`}>
                <h2 className="text-lg font-bold hover:underline">{story.title}</h2>
              </Link>
              <p className="text-gray-700 line-clamp-3 mt-1">{story.content.slice(0, 200)}...</p>
              <Link
                href={`/stories/${story._id}`}
                className="text-blue-600 hover:underline mt-2 inline-block"
              >
                Baca Selengkapnya
              </Link>

              {/* {story.packageId?.title && (
                <p className="text-sm text-blue-600 mt-2">
                  Paket: <Link href={`/packages/${story.packageId._id}`} className="underline">{story.packageId.title}</Link>
                </p>
              )} */}

              {Array.isArray(story.media) && story.media.length > 0 && (
                <img src={story.media[0]} alt="cover" className="mt-3 w-full max-w-md rounded" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default StoriesPage