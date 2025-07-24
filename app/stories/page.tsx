'use client'

import { useEffect, useState } from "react"
import Link from "next/link"
import { Story } from "@/types/story"
import { PenSquare } from "lucide-react"
import { Button } from "@/components/ui/Button"
import StoryCard from "@/components/StoryCard"

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
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <PenSquare className="h-4 w-4" />
            Travel Stories
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Cerita Perjalanan
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Traveler</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Jelajahi pengalaman nyata dari fellow travelers dan dapatkan inspirasi untuk petualangan berikutnya
          </p>
          <Button 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            onClick={() => window.location.href = '/dashboard/customer/stories/new'}
          >
            <PenSquare className="h-4 w-4 mr-2" />
            Tulis Cerita Anda
          </Button>
        </div>

        {/* Search & Filter */}

        {/* Story Grid */}
        {stories.length === 0 ? (<p className="text-gray-600">Belum ada cerita perjalanan.</p>) :
          (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {stories.map((story, index) => (
                <StoryCard key={story._id} story={story} />
              ))}
            </div>
          )
        }

      </main>
    </div>
  )
}

export default StoriesPage