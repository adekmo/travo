'use client'

import { useEffect, useState } from 'react'
import { Story } from '@/types/story'
import Link from 'next/link'
import { Award, Star, Heart, Eye, MapPin, Calendar, TrendingUp, ArrowRight, MessageCircle } from 'lucide-react'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import Image from 'next/image'
import { Card, CardContent } from './ui/Card'
import { Badge } from './ui/Badge'
import { Avatar, AvatarFallback, AvatarImage } from './ui/Avatar'
import { Button } from './ui/Button'

const FeaturedStory = () => {
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await fetch('/api/stories?featured=true')
        if (res.ok) {
          const data = await res.json()
          setStories(data)
        }
      } catch (err) {
        console.error('Gagal memuat featured stories', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStories()
  }, [])

  if (loading || stories.length === 0) return null

  return (
    <section className="py-20 relative bg-gradient-to-b from-white to-blue-50/30 dark:from-background dark:to-blue-950/30">
        {/* BackgroundPattern */}
        <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-10 left-10 w-32 h-32 bg-blue-200/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-200/15 rounded-full blur-3xl animate-pulse delay-1000" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-200/10 rounded-full blur-3xl animate-pulse delay-500" />
        </div>

        <div className='container mx-auto px-4 relative z-10"'>
            {/* Section Header */}
            <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-6 py-3 rounded-full text-sm font-semibold mb-6 shadow-lg">
                    <Award className="h-4 w-4" />
                    Featured Stories
                </div>
                
                <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                    <span className="bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent dark:from-white dark:to-blue-200">
                    Cerita Perjalanan Terbaik
                    </span>
                    <br />
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    dari Para Traveler
                    </span>
                </h2>
                
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                    Temukan inspirasi liburanmu dari pengalaman nyata para traveler yang berbagi cerita menarik mereka!
                </p>
            </div>

            {/* Featured Story Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
                {/* Main Featured Story */}
                {stories.map((story) => (
                    <div key={story._id} className="block border border-gray-200 dark:border-gray-700 rounded-lg p-5 hover:shadow-lg transition">
                        <div className="lg:col-span-2">
                            <Card className="group overflow-hidden border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 bg-white/90 backdrop-blur-sm">
                            {/* Hero Image */}
                            <div className="relative aspect-[16/9] overflow-hidden">
                                {Array.isArray(story.media) && story.media.length > 0 && (
                                    <div className="relative aspect-[16/10] overflow-hidden">
                                        <Image src={story.media[0]} alt={story.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                                    </div>
                                )}
                                
                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                                
                                {/* Featured Badge */}
                                <div className="absolute top-6 left-6">
                                    <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 px-4 py-2 font-semibold shadow-lg">
                                        <Star className="h-3 w-3 mr-1 fill-current" />
                                        Featured
                                    </Badge>
                                </div>

                                {/* Stats Overlay */}
                                <div className="absolute top-6 right-6 flex gap-2">
                                    <div className="bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                                        <Heart className="h-3 w-3" />
                                        {story.likes.length}
                                    </div>
                                    <div className="bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                                        <MessageCircle className="h-3 w-3" />
                                        {story.commentCount}
                                    </div>
                                    <div className="bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                                        <Eye className="h-3 w-3" />
                                        2.4k
                                    </div>
                                </div>

                                {/* Title Overlay */}
                                <div className="absolute bottom-6 left-6 right-6">
                                        <Badge variant="secondary" className="bg-white/20 backdrop-blur-sm text-white border-white/30 mb-3 hover:bg-white/30 transition-colors">
                                        <MapPin className="h-3 w-3 mr-1" />
                                            {story.packageId?.location}
                                        </Badge>
                                        <h3 className="text-2xl lg:text-3xl font-bold text-white mb-2 line-clamp-2 group-hover:text-blue-200 transition-colors">
                                            {story.title}
                                        </h3>
                                </div>
                            </div>

                            {/* Content */}
                            <CardContent className="p-8">
                                {/* Author & Meta */}
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-12 w-12 ring-2 ring-blue-100">
                                        <AvatarImage src={story.userId?.avatar} alt={story.userId?.name} />
                                        <AvatarFallback>{story.userId?.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-semibold text-gray-900">{story.userId?.name}</p>
                                            <div className="flex items-center gap-3 text-sm text-gray-500">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    {format(new Date(story.createdAt), 'dd MMM yyyy', { locale: id })}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <TrendingUp className="h-3 w-3" />
                                                    Trending
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Excerpt */}
                                <p className="text-gray-600 leading-relaxed mb-6 line-clamp-3">
                                    {story.content}
                                </p>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {story.tags.slice(0, 4).map((tag) => (
                                        <Badge
                                        key={tag}
                                        variant="secondary"
                                        className="bg-blue-50 text-blue-700 hover:bg-blue-100 cursor-pointer text-xs"
                                        >
                                        #{tag}
                                        </Badge>
                                    ))}
                                </div>

                                {/* Actions */}
                                <div className="flex items-center justify-between">
                                {/* <div className="flex items-center gap-6 text-sm text-gray-500">
                                    <span className="flex items-center gap-1">
                                    <Heart className="h-4 w-4" />
                                    {story.likes + (likedStories.has(mainStory.id) ? 1 : 0)}
                                    </span>
                                    <span className="flex items-center gap-1">
                                    <MessageCircle className="h-4 w-4" />
                                    24 komentar
                                    </span>
                                </div> */}
                                
                                <Link href={`/stories/${story._id}`}>
                                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                                    Baca Cerita
                                    <ArrowRight className="h-4 w-4 ml-2" />
                                    </Button>
                                </Link>
                                </div>
                            </CardContent>
                            </Card>
                        </div>
                    </div>
                ))}
            </div>

            <div className="text-center mt-12">
                <Link href="/stories">
                    <Button 
                    variant="outline" 
                    size="lg" 
                    className="bg-white/80 hover:bg-white border-blue-200 text-blue-700 hover:text-blue-800 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                    Lihat Semua Cerita Travel
                    <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                </Link>
                </div>
        </div>
    </section>
  )
}

export default FeaturedStory
