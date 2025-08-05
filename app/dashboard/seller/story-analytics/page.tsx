'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { BookOpen } from 'lucide-react'
import { PackageWithStoryCount } from '@/types/analytics'
import Image from 'next/image'

export default function SellerStoryAnalyticsPage() {
  const [data, setData] = useState<PackageWithStoryCount[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch('/api/seller/story-analytics')
        if (res.ok) {
          const result = await res.json()
          setData(result)
        }
      } catch (err) {
        console.error("❌ Gagal mengambil data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  if (loading) return <div className="p-6">Memuat data analytics...</div>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Analytics Cerita Pelanggan</h1>
      <p className="text-gray-600 mb-6">
        Lihat berapa banyak pelanggan yang menulis cerita dari setiap paket wisata Anda.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((pkg) => (
          <div
            key={pkg._id}
            className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 bg-white dark:bg-gray-900 shadow-md hover:shadow-lg transition"
          >
            <h2 className="text-lg font-semibold mb-2">{pkg.title}</h2>
            <p className="text-sm text-gray-500 mb-4">{pkg.location}</p>
            <div className='relative h-36 overflow-hidden'>
                <Image
                    src={pkg.image}
                    alt={pkg.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-blue-600 dark:text-blue-400 font-semibold">
                {pkg.totalStories} Cerita
              </span>
              {pkg.totalStories > 0 && (
                <Link
                  href={`/dashboard/seller/stories?package=${pkg._id}`}
                  className="text-sm text-blue-500 hover:underline flex items-center gap-1"
                >
                  <BookOpen className="h-4 w-4" />
                  Lihat Cerita
                </Link>
              )}
            </div>
          </div>
        ))}
        {data.length === 0 && (
          <div className="col-span-full text-center text-gray-500">
            Belum ada cerita dari pelanggan.
          </div>
        )}
      </div>
    </div>
  )
}
