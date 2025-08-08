'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { TravelPackage } from '@/types/travelPackage';
import { Edit, HashIcon, MapPin, PlusCircle, Trash2 } from 'lucide-react';
import Image from 'next/image';

const SellerPackagePage = () => {
    const [packages, setPackages] = useState<TravelPackage[]>([]);
    console.log(packages, 'pckgs');
    
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchPackages = async () => {
        setLoading(true);
        const res = await fetch('/api/seller/packages');
        const data = await res.json();
        setPackages(data);
        setLoading(false);
    };

    useEffect(() => {
      fetchPackages();
    }, []);

    const handleDelete = async (id: string) => {
      if (!confirm('Yakin ingin menghapus paket ini?')) return;

      const res = await fetch(`/api/seller/packages/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setPackages((prev) => prev.filter((p) => p._id !== id));
      } else {
        alert('Gagal menghapus paket');
      }
    };
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Paket Travel Saya</h1>
        <button
          onClick={() => router.push('/dashboard/seller/packages/new')}
          className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          <PlusCircle className="h-4 w-4" />Tambah Paket
        </button>
      </div>

      {loading ? (
        <p>Memuat data...</p>
      ) : packages.length === 0 ? (
        <p>Tidak ada paket travel</p>
      ) : (
        <div className="grid gap-4">
          {packages.map((pkg) => (
            <div
              key={pkg._id}
              className="border p-4 rounded shadow-sm bg-white flex justify-between items-center"
            >
              <div className='w-full max-w-sm group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white dark:bg-gray-900'>
                <div className='relative h-56 overflow-hidden'>
                  {pkg.image && (
                    <Image 
                      src={pkg.image || "/placeholder.jpg"}
                      alt={pkg.title}
                      fill
                      className="rounded group-hover:scale-110 transition-transform duration-700"
                    />
                  )}
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg">
                  <div className="flex items-center gap-1">
                    <HashIcon className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-semibold text-gray-800">
                      {pkg.category?.name || 'Tanpa kategori'}
                    </span>
                  </div>
                </div>
              </div>
                <div className='p-6 space-y-2'>
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
                  <p className="font-bold line-clamp-2 leading-relaxed">
                    Rp {pkg.price.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    router.push(`/dashboard/seller/packages/${pkg._id}/edit`)
                  }
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 flex items-center gap-1 text-sm font-medium"
                >
                  <Edit className="h-3 w-3" />Edit
                </button>
                <button
                  onClick={() => handleDelete(pkg._id!)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 flex items-center gap-1 text-sm font-medium"
                >
                  <Trash2 className="h-3 w-3" />Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SellerPackagePage