'use client'

import { useEffect, useState } from "react";

const SellerStats = () => {

    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
        const res = await fetch("/api/seller/stats");
        const data = await res.json();
        setStats(data);
        setLoading(false);
        };
        fetchStats();
    }, []);

  if (loading) return <p>Memuat statistik...</p>;
  if (!stats) return <p>Tidak ada data statistik.</p>;
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
      <div className="p-4 border rounded shadow">
        <h3 className="font-semibold">Total Paket</h3>
        <p className="text-xl">{stats.totalPackages}</p>
      </div>
      <div className="p-4 border rounded shadow">
        <h3 className="font-semibold">Semua Booking</h3>
        <p className="text-xl">{stats.totalBookings}</p>
      </div>
      <div className="p-4 border rounded shadow">
        <h3 className="font-semibold">Booking (Pending)</h3>
        <p className="text-xl">{stats.pendingBookings}</p>
      </div>
      <div className="p-4 border rounded shadow">
        <h3 className="font-semibold">Booking (Confirmed)</h3>
        <p className="text-xl">{stats.confirmedBookings}</p>
      </div>
      <div className="p-4 border rounded shadow">
        <h3 className="font-semibold">Total Pendapatan</h3>
        <p className="text-xl">Rp {stats.totalRevenue.toLocaleString("id-ID")}</p>
      </div>
      <div className="p-4 border rounded shadow">
        <h3 className="font-semibold">Total Review</h3>
        <p className="text-xl">{stats.totalReviews}</p>
      </div>
      <div className="p-4 border rounded shadow">
        <h3 className="font-semibold">Rata-rata Rating</h3>
        <p className="text-xl">{stats.avgRating} / 5</p>
      </div>
    </div>
  )
}

export default SellerStats