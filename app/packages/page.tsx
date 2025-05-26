// app/packages/page.tsx
import PackageCard from '@/components/PackageCard'
import { TravelPackage } from '@/types/travelPackage'

const fetchPackages = async (): Promise<TravelPackage[]> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/packages`, {
    cache: 'no-store',
  })
  if (!res.ok) {
    throw new Error('Gagal memuat data paket')
  }
  return res.json()
}

export default async function PackagesPage() {
  const packages = await fetchPackages()

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Paket Travel Tersedia</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {packages.length > 0 ? (
          packages.map((pkg) => <PackageCard key={pkg._id} pkg={pkg} />)
        ) : (
          <p>Tidak ada paket tersedia saat ini.</p>
        )}
      </div>
    </div>
  )
}
