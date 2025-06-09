'use client'

import { Review } from '@/types/review'
import { useEffect, useState } from 'react'

const PackagesReviewList = ({ packageId }: { packageId: string }) => {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReviews = async () => {
      const res = await fetch(`/api/reviews?packageId=${packageId}`)
      if (res.ok) {
        const data = await res.json()
        setReviews(data)
      }
      setLoading(false)
    }

    fetchReviews()
  }, [packageId])

  if (loading) return <p>Memuat ulasan...</p>
  if (reviews.length === 0) return <p>Belum ada ulasan.</p>

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Ulasan Pelanggan</h2>
      <ul className="space-y-4">
        {reviews.map((review) => (
          <li key={review._id} className="p-4 border rounded shadow-sm">
            <p className="font-semibold">{review.customer.name}</p>
            <p className="text-yellow-500">Rating: {review.rating} / 5</p>
            {review.comment && <p className="italic">"{review.comment}"</p>}
            <p className="text-sm text-gray-500">
              {new Date(review.createdAt).toLocaleDateString('id-ID')}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default PackagesReviewList
