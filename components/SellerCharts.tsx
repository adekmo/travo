'use client'

import { ChartData } from "@/types/chartData";
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, CartesianGrid, ResponsiveContainer, Legend } from "recharts";


const SellerCharts = () => {
    const [data, setData] = useState<ChartData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchChartData = async () => {
        const res = await fetch("/api/seller/chart-data");
        if (res.ok) {
            const json = await res.json();
            setData(json);
        }
        setLoading(false);
        };

        fetchChartData();
    }, []);

    if (loading) return <p>Memuat grafik...</p>;
  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-xl font-semibold mb-4">Jumlah Booking per Bulan</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="month" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <CartesianGrid strokeDasharray="3 3" />
            <Bar dataKey="bookings" fill="#8884d8" name="Jumlah Booking" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="p-5">
        <h2 className="text-xl font-semibold mb-4">Pendapatan per Bulan</h2>
        <ResponsiveContainer width="100%" height={300} className="p-2">
          <LineChart data={data}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <CartesianGrid strokeDasharray="3 3" />
            <Line type="monotone" dataKey="revenue" stroke="#82ca9d" name="Pendapatan" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default SellerCharts