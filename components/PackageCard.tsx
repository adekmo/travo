'use client'

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
// import { useRouter } from "next/navigation"

import { TravelPackage } from '@/types/travelPackage'
import Link from 'next/link'
import { ArrowRight, Calendar, Clock, MapPin, Star, Tag, Users } from "lucide-react"
import Image from "next/image"

const PackageCard = ({ pkg }: { pkg: TravelPackage }) => {
  const { data: session } = useSession()
  // const router = useRouter()

  const [isWishlisted, setIsWishlisted] = useState(false)
  const [loading, setLoading] = useState(false)

    useEffect(() => {
      const fetchWishlist = async () => {
        if (session?.user?.role === 'customer') {
          const res = await fetch('/api/wishlist')
          const data = await res.json()
          if (Array.isArray(data)) {
            // const exists = data.some((item: any) => item._id === pkg._id)
            const exists = data.some((item: { _id: string }) => item._id === pkg._id)
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

      await res.json()
      setIsWishlisted((prev) => !prev)
    } catch (err) {
      console.error(err)
      alert("Terjadi kesalahan")
    }

    setLoading(false)
  }


  return (
    <div className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white dark:bg-gray-900">
      {pkg.image && (
        <div className="relative h-56 overflow-hidden">
          <Image
            src={pkg.image}
            alt={pkg.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
          />
            <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-semibold text-gray-800">
                {pkg.averageRating?.toFixed(1) || "0.0"}
              </span>
            </div>
        </div>
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
        <div className="p-6 space-y-2">
          <h3 className="font-bold text-xl text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors duration-300 line-clamp-1">
            {pkg.title}
          </h3>

          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
            <div className="bg-green-100 dark:bg-green-900/30 p-1 rounded-full">
              <MapPin className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-sm font-medium">{pkg.location}</span>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
            {pkg.description}
          </p>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-1 rounded-full">
                <Clock className="h-3 w-3 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="font-medium">{pkg.duration}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <div className="bg-purple-100 dark:bg-purple-900/30 p-1 rounded-full">
                <Users className="h-3 w-3 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="font-medium">{pkg.maxPeople} orang</span>
            </div>
          </div>

          <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Mulai dari
                </span>
                <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Rp{pkg.price.toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  per orang
                </div>
                <div className="text-xs text-green-600 dark:text-green-400 font-semibold">
                  💰 Hemat 20%
                </div>
              </div>
            </div>
          </div>
        </div>

      <div className="p-6 pt-0 flex items-center justify-between">
        <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 rounded">
          <Link
            href={`/packages/${pkg._id}`}
            className="flex items-center justify-center p-3"
          >
            <span>Lihat Detail</span>
            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </button>
        <div className="flex flex-col items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400 p-2">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>Tersedia hari ini</span>
          </div>
          <div className="flex items-center gap-1">
            <Tag className="h-3 w-3" />
            <span>Free cancellation</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PackageCard