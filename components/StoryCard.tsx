import Link from "next/link"
import { Story } from "@/types/story"
import { Card, CardContent } from "./ui/Card"
import { ArrowRight, Clock, Heart, HeartHandshake, MapPin, MessageCircle, Play, Share2 } from "lucide-react"
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar"
import { formatDistanceToNow } from "date-fns"
import { id } from "date-fns/locale"
import { Button } from "./ui/Button"

type StoryCardProps = {
  story: Story
}

const StoryCard = ({ story }: StoryCardProps ) => {
    const formatTimeAgo = (dateString: string) => {
        return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: id,
        });
    };
  return (
    <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
        {/* Media Section */}
        {Array.isArray(story.media) && story.media.length > 0 && (
            <div className="relative aspect-[16/10] overflow-hidden">
                <Image src={story.media[0]} alt={story.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
        )}

        <CardContent className="p-6">
            {/* Author */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 ring-2 ring-blue-100">
                        <AvatarImage src={story.userId?.avatar} alt={story.userId?.name} />
                        <AvatarFallback>{story.userId?.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold text-gray-900">{story.userId?.name}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Clock className="h-3 w-3" />
                            {formatTimeAgo(story.createdAt)}
                        </div>
                    </div>
                </div>
            </div>

            {/* Package Info */}
            <Link href={`/stories/${story._id}`} className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 mb-3 group">
                <MapPin className="h-4 w-4" />
                    <span className="font-medium">{story.packageId?.title}</span>
                    <span className="text-gray-400">•</span>
                    <span>{story.packageId?.location}</span>
                <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>

            {/* Title & Content */}
            <Link href={`/stories/${story._id}`} className="block group">
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {story.title}
                </h3>
                <p className="text-gray-600 line-clamp-3 mb-4 leading-relaxed">
                    {story.content}
                </p>
            </Link>

            {/* Action */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Heart className="h-5 w-5 text-gray-500" />
                         <span className="text-sm text-gray-500 font-medium">{story.likes.length}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MessageCircle className="h-5 w-5 text-gray-500" />
                        <span className="text-sm text-gray-500 font-medium">{story.commentCount}</span>
                    </div>
                </div>

                <Link href={`/stories/${story._id}`}>
                    <Button
                    variant="ghost"
                    size="sm"
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                    Baca Selengkapnya
                    <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                </Link>
            </div>
        </CardContent>
    </Card>
  )
}

export default StoryCard