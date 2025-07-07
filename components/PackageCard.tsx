'use client'

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

import { TravelPackage } from '@/types/travelPackage'
import Link from 'next/link'
import { Badge, Clock, MapPin, Star, Users } from "lucide-react"

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
        <div className="relative h-48 overflow-hidden">
          <img
            src={pkg.image}
            alt={pkg.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
      </div>
        
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
        <div className="p-4">
          <h3 className="font-semibold text-lg text-foreground mb-2 line-clamp-1">
              {pkg.title}
          </h3>

          <div className="flex justify-between items-center text-muted-foreground mb-2">
            <div className="flex gap-1 items-center">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">{pkg.location}</span>
            </div>
            <p className="text-sm">#{pkg.category?.name ? pkg.category?.name : 'Tanpa Kategori'}</p>
          </div>

          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {pkg.description}
          </p>

          <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {/* <span>{duration}</span> */}
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {/* <span>{maxPeople} orang</span> */}
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>{pkg.averageRating?.toFixed(1) || "0.0"}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm text-muted-foreground">Harga</span>
              <p className="text-lg font-bold text-primary">
                Rp{pkg.price.toLocaleString()} / orang
              </p>
            </div>
          </div>
        </div>

      {/* <p className="text-sm mb-2">{new Date(pkg.date).toLocaleDateString()}</p> */}
      <Link
        href={`/packages/${pkg._id}`}
        className="w-full text-white bg-blue-600 px-3 py-1 rounded hover:bg-blue-700"
      >
        Lihat Detail
      </Link>
    </div>
  )
}

export default PackageCard