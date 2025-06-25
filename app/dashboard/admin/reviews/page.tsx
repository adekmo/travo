'use client'

import { Review } from '@/types/review'
import { useEffect, useState } from 'react'

const AdminReviewsPage = () => {
    const [reviews, setReviews] = useState<Review[]>([])

    useEffect(() => {
        const fetchReviews = async () => {
        const res = await fetch('/api/admin/reviews')
        const data = await res.json()
        setReviews(data.reviews || [])
        }

        fetchReviews()
    }, [])

    const handleDelete = async (id: string) => {
        const confirm = window.confirm('Yakin ingin menghapus review ini?')
        if (!confirm) return

        const res = await fetch(`/api/admin/reviews/${id}`, {
        method: 'DELETE',
        })

        if (res.ok) {
        setReviews(reviews.filter((r: any) => r._id !== id))
        }
    }

    const handleHide = async (id: string) => {
        const res = await fetch(`/api/admin/reviews/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({ hidden: true }),
            headers: { 'Content-Type': 'application/json' },
        })

        if (res.ok) {
            setReviews((prev) =>
            prev.map((r) => (r._id === id ? { ...r, hidden: true } : r))
            )
        }
        }

    const handleShow = async (id: string) => {
        const res = await fetch(`/api/admin/reviews/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({ hidden: false }),
            headers: { 'Content-Type': 'application/json' },
        })

        if (res.ok) {
            setReviews((prev) =>
            prev.map((r) => (r._id === id ? { ...r, hidden: false } : r))
            )
        }
        }
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Moderasi Review</h1>
      <ul className="space-y-4">
        {reviews.length === 0 && <p>Belum ada review.</p>}
        {reviews.map((r: any) => (
          <li key={r._id} className="border p-4 rounded shadow text-sm">
            <p><strong>Customer:</strong> {r.customer?.name || 'N/A'}</p>
            <p><strong>Paket:</strong> {r.package?.title || 'N/A'}</p>
            <p><strong>Rating:</strong> {r.rating} / 5</p>
            <p><strong>Komentar:</strong> {r.comment || '-'}</p>
            <p className="text-xs text-gray-500">{new Date(r.createdAt).toLocaleString()}</p>
            <div className="mt-2 flex gap-2">
                {!r.hidden ? (
                  <>
                    <button
                      onClick={() => handleHide(r._id)}
                      className="px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      Sembunyikan
                    </button>
                    <button
                      onClick={() => handleDelete(r._id)}
                      className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Hapus
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleShow(r._id)}
                    className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Tampilkan
                  </button>
                )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default AdminReviewsPage