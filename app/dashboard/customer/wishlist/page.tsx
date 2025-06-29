'use client'

import { useEffect, useState } from 'react'
import { TravelPackage } from '@/types/travelPackage'
import PackageCard from '@/components/PackageCard'

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState<TravelPackage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWishlist = async () => {
      const res = await fetch('/api/wishlist')
      const data = await res.json()
      console.log("WISHLIST RESPONSE:", data)
      setWishlist(data)
      setLoading(false)
    }

    fetchWishlist()
  }, [])

  if (loading) return <p>Memuat wishlist...</p>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Wishlist Saya</h1>
      {wishlist.length === 0 ? (
        <p>Belum ada paket di wishlist Anda.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((pkg) => (
            <PackageCard key={pkg._id} pkg={pkg} />
          ))}
        </div>
      )}
    </div>
  )
}

export default WishlistPage
