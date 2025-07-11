'use client'

import { useEffect, useState } from "react"
import { Review } from "@/types/review"
import Link from "next/link"
import { Star } from "lucide-react"

interface Props {
  limit?: number
  showSeeMore?: boolean
}

const SellerReviewList = ({ limit, showSeeMore }: Props) => {
    const [reviews, setReviews] = useState<Review[]>([])
    const [hasMore, setHasMore] = useState(false);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchReviews = async () => {
        const res = await fetch("/api/seller/reviews")
        if (res.ok) {
            const data = await res.json()
            const sorted = data.sort((a: Review, b: Review) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            if (limit && sorted.length > limit) {
              setHasMore(true)
              setReviews(sorted.slice(0, limit))
            } else {
              setHasMore(false)
              setReviews(sorted)
            }
        }
        setLoading(false)
        }

        fetchReviews()
    }, [limit])

    if (loading) return <p>Memuat ulasan...</p>
    if (reviews.length === 0) return <p>Belum ada ulasan untuk paket Anda.</p>
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Ulasan dari Customer</h2>
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review._id} className="p-4 bg-muted/50 rounded-lg space-y-2">
            <div className='flex items-center justify-between'>
              <h4 className="font-medium text-sm">
                {review.package?.title || 'N/A'}
              </h4>
              <p className="text-sm text-muted-foreground flex items-center gap-3">
                <Star className="h-4 w-4 text-yellow-500" /> {review.rating} / 5
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
                <span className="italic">{review.comment || '-'}</span> - {review.customer?.name || 'N/A'}
              </p>
              <p className="text-xs text-muted-foreground">
                {new Date(review.createdAt).toLocaleString()}
              </p>
          </div>
        ))}
      </div>

      {showSeeMore && hasMore && (
        <div className="mt-4">
          <Link href="/dashboard/seller/reviews" className="text-blue-600 hover:underline">
            Lihat Semua Ulasan →
          </Link>
        </div>
      )}
    </div>
  )
}

export default SellerReviewList