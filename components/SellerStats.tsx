'use client'

import { Stat } from "@/types/stat";
import { CheckCheck, CheckCircle, DollarSign, Package, Star, ViewIcon, Watch } from "lucide-react";
import { useEffect, useState } from "react";

interface SellerStatsType {
  totalPackages: number
  totalBookings: number
  pendingBookings: number
  confirmedBookings: number
  totalRevenue: number
  totalReviews: number
  avgRating: number
}

const SellerStats = () => {

    const [stats, setStats] = useState<SellerStatsType | null>(null)
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-blue-100 p-5 rounded">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <p className="text-sm font-medium">Total Paket</p>
          <Package className="h-4 w-4 text-muted-foreground" />
        </div>
        <div>
          <div className="text-2xl font-bold">{stats.totalPackages}</div>
        </div>
      </div>
      <div className="bg-blue-100 p-5 rounded">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <p className="text-sm font-medium">Semua Booking</p>
          <CheckCheck className="h-4 w-4 text-muted-foreground" />
        </div>
        <div>
          <div className="text-2xl font-bold">{stats.totalBookings}</div>
        </div>
      </div>
      <div className="bg-blue-100 p-5 rounded">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <p className="text-sm font-medium">Booking (Pending)</p>
          <Watch className="h-4 w-4 text-muted-foreground" />
        </div>
        <div>
          <div className="text-2xl font-bold">{stats.pendingBookings}</div>
        </div>
      </div>
      <div className="bg-blue-100 p-5 rounded">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <p className="text-sm font-medium">Booking (Confirmed)</p>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </div>
        <div>
          <div className="text-2xl font-bold">{stats.confirmedBookings}</div>
        </div>
      </div>
      <div className="bg-blue-100 p-5 rounded">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <p className="text-sm font-medium">Total Pendapatan</p>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </div>
        <div>
          <div className="text-2xl font-bold">Rp {stats.totalRevenue.toLocaleString("id-ID")}</div>
        </div>
      </div>
      <div className="bg-blue-100 p-5 rounded">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <p className="text-sm font-medium">Total Reviews</p>
          <ViewIcon className="h-4 w-4 text-muted-foreground" />
        </div>
        <div>
          <div className="text-2xl font-bold">{stats.totalReviews}</div>
        </div>
      </div>
      <div className="bg-blue-100 p-5 rounded">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <p className="text-sm font-medium">Rata-Rata Rating</p>
          <Star className="h-4 w-4 text-muted-foreground" />
        </div>
        <div>
          <div className="text-2xl font-bold">{stats.avgRating} / 5</div>
        </div>
      </div>
    </div>
  )
}

export default SellerStats