import { TravelPackage } from '@/types/travelPackage'
import Link from 'next/link'

const PackageCard = ({ pkg }: { pkg: TravelPackage }) => {
  return (
    <div className="border rounded-lg shadow p-4">
      {pkg.image && (
        <img
          src={pkg.image}
          alt={pkg.title}
          className="w-full h-48 object-cover rounded mb-3"
        />
      )}
      <h2 className="text-xl font-semibold">{pkg.title}</h2>
      <p className="text-gray-600">{pkg.location}</p>
      {/* <p className="text-sm mb-2">{new Date(pkg.date).toLocaleDateString()}</p> */}
      <p className="font-bold text-blue-600 mb-4">Rp{pkg.price.toLocaleString()}</p>
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