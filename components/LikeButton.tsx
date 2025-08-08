'use client'

import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react' // pakai ikon lucide (pastikan kamu sudah install)
// import { cn } from '@/lib/utils'

type Props = {
  storyId: string
}

const LikeButton = ({storyId}: Props) => {

    const { data: session } = useSession()
    const [liked, setLiked] = useState(false)
    const [totalLikes, setTotalLikes] = useState(0)

    useEffect(() => {
        const fetchLikes = async () => {
        const res = await fetch(`/api/stories/${storyId}`)
        const data = await res.json()
        setTotalLikes(data.likes?.length || 0)
        if (session?.user && data.likes?.includes(session.user.id)) {
            setLiked(true)
        }
        }

        fetchLikes()
    }, [session, storyId])

    const handleLike = async () => {
        const res = await fetch(`/api/stories/${storyId}/like`, {
        method: 'POST',
        })

        const data = await res.json()
        setLiked(data.liked)
        setTotalLikes(data.totalLikes)
    }
  return (
    <button
        onClick={handleLike}
        className={`flex items-center gap-2 transition-colors ${
        liked
            ? "text-red-500"
            : "text-gray-700 hover:text-red-500"
        }`}
    >
        <Heart
        className={`h-5 w-5 ${liked ? "fill-current" : ""}`}
        />
        <span className="text-sm font-medium">
        {totalLikes}
        </span>
    </button>
  )
}

export default LikeButton