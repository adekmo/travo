'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { TravelPackage } from '@/types/travelPackage';

const SellerPackagePage = () => {
    const [packages, setPackages] = useState<TravelPackage[]>([]);
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
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Tambah Paket
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
              <div>
                <h2 className="text-xl font-semibold">{pkg.title}</h2>
                <p className="text-sm text-gray-600">{pkg.location}</p>
                <p className="text-sm text-gray-600">
                  {new Date(pkg.date).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-800 font-medium">
                  Rp {pkg.price.toLocaleString()}
                </p>
                {pkg.image && (
                <img src={pkg.image} alt={pkg.title} className="w-full max-w-sm rounded mb-2" />
              )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    router.push(`/dashboard/seller/packages/${pkg._id}/edit`)
                  }
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(pkg._id!)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Hapus
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