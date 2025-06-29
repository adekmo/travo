'use client'

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

import { TravelPackage } from '@/types/travelPackage'
import Link from 'next/link'

const PackageCard = ({ pkg }: { pkg: TravelPackage }) => {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [isWishlisted, setIsWishlisted] = useState(false)
  const [loading, setLoading] = useState(false)

    useEffect(() => {
    const fetchWishlist = async () => {
      if (session?.user?.role === 'customer') {
        const res = await fetch('/api/wishlist')
        const data = await res.json()
        if (Array.isArray(data)) {
          const exists = data.some((item: any) => item._id === pkg._id)
          setIsWishlisted(exists)
        } else {
          console.warn("Wishlist response is not an array:", data)
        }
      }
    }

    fetchWishlist()
  }, [session, pkg._id])

  const toggleWishlist = async () => {
    if (!session) {
      alert("Silakan login terlebih dahulu")
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageId: pkg._id }),
      })

      const data = await res.json()
      setIsWishlisted((prev) => !prev)
    } catch (err) {
      console.error(err)
      alert("Terjadi kesalahan")
    }

    setLoading(false)
  }


  return (
    <div className="border rounded-lg shadow p-4 relative">
      {pkg.image && (
        <img
          src={pkg.image}
          alt={pkg.title}
          className="w-full h-48 object-cover rounded mb-3"
        />
        )}

        {session?.user?.role === 'customer' && (
          <button
            onClick={toggleWishlist}
            className="absolute top-2 right-2 text-xl z-10"
            disabled={loading}
            title={isWishlisted ? "Hapus dari Wishlist" : "Tambah ke Wishlist"}
          >
            {isWishlisted ? '💖' : '🤍'}
          </button>
        )}
      <h2 className="text-xl font-semibold">{pkg.title}</h2>
      <p className="text-gray-600">{pkg.location}</p>
      {/* <p className="text-sm mb-2">{new Date(pkg.date).toLocaleDateString()}</p> */}
      <p className="font-bold text-blue-600 mb-4">Rp{pkg.price.toLocaleString()}</p>
      <p className="text-gray-600">#{pkg.category?.name ? pkg.category?.name : 'Tanpa Kategori'}</p>
      <Link
        href={`/packages/${pkg._id}`}
        className="text-white bg-blue-600 px-3 py-1 rounded hover:bg-blue-700"
      >
        Lihat Detail
      </Link>
    </div>
  )
}

export default PackageCard