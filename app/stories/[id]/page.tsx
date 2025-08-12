
import React from "react"
import { notFound } from "next/navigation"
import { format } from "date-fns"
import { id as localeId} from "date-fns/locale"
import CommentSection from "@/components/CommentSection"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Calendar, ExternalLink, Eye, MapPin } from "lucide-react"
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
import { Card, CardContent } from "@/components/ui/Card"
import BackButton from "@/components/BackButton"
import LikeButton from "@/components/LikeButton"
import ShareButton from "@/components/ShareButton"

interface StoryPageProps {
  params: {
    id: string
  }
}

const getStory = async (id: string) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/stories/${id}`, {
      cache: "no-store",
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

const DetailStory = async ({ params }: StoryPageProps) => {
  const { id } = params;
  const story = await getStory(id)
  
  if (!story) return notFound()
  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/stories" className="hover:text-blue-600 transition-colors">
            Travel Stories
          </Link>
          <span>•</span>
          <span className="text-gray-900 truncate">{story.title}</span>
        </div>

        {/* BackButton */}
        <BackButton />

        {/* StoryHeader */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          {Array.isArray(story.media) && story.media.length > 0 && (
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image src={story.media[0]} alt={story.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500 rounded" />
            </div> 
          )}
        </div>

        <div className="p-8">
          {/* Package Link */}
          <Link 
            href={`/packages/${story.packageId._id}`}
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 group"
          >
            <MapPin className="h-4 w-4" />
            <span className="font-medium">{story.packageId.title}</span>
            <span className="text-gray-400">•</span>
            <span>{story.packageId.location}</span>
            <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
            {story.title}
          </h1>
          
          {/* Author */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12 ring-2 ring-blue-100">
                <AvatarImage src={story.userId?.avatar} alt={story.userId?.name} />
                <AvatarFallback>{story.userId.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                  <p className="font-semibold text-gray-900">{story.userId?.name}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(story.createdAt), "dd MMMM yyyy", { locale: localeId })}
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      234 views
                    </div>
                  </div>
                </div>
            </div>
            <div className="flex items-center justify-between gap-2 pt-4 border-t border-gray-100">
                <LikeButton storyId={story._id} />
                <ShareButton title={story.title} />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
          <div className="prose prose-lg max-w-none">
            {story.content.split('\n\n').map((paragraph: string, index: number) => {
              if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                return (
                  <h3 key={index} className="text-xl font-bold text-gray-900 mt-8 mb-4 first:mt-0">
                    {paragraph.slice(2, -2)}
                  </h3>
                );
              }
              return (
                <p key={index} className="text-gray-700 leading-relaxed mb-4">
                  {paragraph}
                </p>
              );
            })}
          </div>

          {/* Additional Images */}
          {Array.isArray(story.media) && story.media.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Foto Lainnya</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {story.media.slice(1).map((media:string, index: number) => (
                  <div
                    key={index}
                    className="aspect-square relative overflow-hidden rounded-lg cursor-pointer group"
                    // onClick={() => setSelectedImageIndex(index + 1)}
                  >
                    <Image
                      src={media}
                      alt={`media-${index}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Related Package CTA */}
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Tertarik dengan paket ini?
                </h3>
                <p className="text-gray-600">
                  Rasakan pengalaman serupa dengan {story.userId?.name}
                </p>
              </div>
              <Link href={`/packages/${story.packageId._id}`}>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Lihat Paket
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
      <CommentSection storyId={story._id} />
    </div>
    
  )
}

export default DetailStory