'use client'

import { useEffect, useState } from "react"
import { Review } from "@/types/review"
import Link from "next/link"

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
      <ul className="space-y-4">
        {reviews.map((review) => (
          <li key={review._id} className="p-4 border rounded shadow-sm">
            <p className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString("id-ID")}</p>
            <p><strong>Paket:</strong> {review.package?.title}</p>
            <p><strong>Customer:</strong> {review.customer?.name}</p>
            <p className="text-yellow-500">Rating: {review.rating} / 5</p>
            {review.comment && <p className="italic">"{review.comment}"</p>}
          </li>
        ))}
      </ul>

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