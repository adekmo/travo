
import React from "react"
import { notFound } from "next/navigation"
import { format } from "date-fns"
import id from "date-fns/locale/id"
import CommentSection from "@/components/CommentSection"

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

const DetailStory = async ({ params }: { params: { id: string } }) => {
  const story = await getStory(params.id)

  if (!story) return notFound()
  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-2">{story.title}</h1>

      <div className="text-sm text-gray-600 mb-4">
        oleh <span className="font-semibold">{story.userId?.name || "Pengguna"}</span> •{" "}
        {format(new Date(story.createdAt), "dd MMMM yyyy", { locale: id })}
      </div>

      {story.packageId?.title && (
        <p className="text-blue-600 mb-4">
          <a href={`/packages/${story.packageId._id}`} className="underline">
            Lihat Paket: {story.packageId.title}
          </a>
        </p>
      )}

      <div className="prose prose-sm sm:prose lg:prose-lg max-w-none mb-6">
        <p>{story.content}</p>
      </div>

      {Array.isArray(story.media) && story.media.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {story.media.map((url: string, idx: number) => (
            <img
              key={idx}
              src={url}
              alt={`media-${idx}`}
              className="rounded-lg border shadow-sm"
            />
          ))}
        </div>
      )}
      <CommentSection storyId={story._id} />
    </div>
    
  )
}

export default DetailStory