'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { TravelPackage } from '@/types/travelPackage'

type Params = { id: string }

const DetailPackagesPage = ({ params }: { params: Promise<Params> }) => {
    const { id } = use(params)
    const [packageData, setPackageData] = useState<TravelPackage | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const fetchPackage = async () => {
        const res = await fetch(`/api/packages/${id}`)
        if (res.ok) {
            const data = await res.json()
            setPackageData(data)
        } else {
            alert('Paket tidak ditemukan')
        }
        setLoading(false)
        }

        fetchPackage()
    }, [id])

    if (loading) {
        return <div>Loading...</div>
    }

    if (!packageData) {
        return <div>Paket tidak ditemukan</div>
    }
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{packageData.title}</h1>
      <img src={packageData.image} alt={packageData.title} className="w-full h-80 object-cover mb-6" />
      <p className="text-lg mb-6">{packageData.description}</p>
      <div className="mb-6">
        <strong>Harga: </strong> Rp {packageData.price}
      </div>
      <div className="mb-6">
        <strong>Lokasi: </strong> {packageData.location}
      </div>
      <div className="mb-6">
        <strong>Tanggal: </strong> {new Date(packageData.date).toLocaleDateString()}
      </div>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={() => router.push(`/packages/${id}/booking`)}
      >
        Pesan Paket
      </button>
    </div>
  )
}

export default DetailPackagesPage