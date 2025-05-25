'use client'

import React from 'react'

const AdminDashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white shadow-md rounded-xl p-4">
          <h2 className="text-lg font-semibold">Total Users</h2>
          <p className="text-3xl font-bold text-blue-600">123</p>
        </div>
        <div className="bg-white shadow-md rounded-xl p-4">
          <h2 className="text-lg font-semibold">Pending Sellers</h2>
          <p className="text-3xl font-bold text-yellow-600">5</p>
        </div>
        <div className="bg-white shadow-md rounded-xl p-4">
          <h2 className="text-lg font-semibold">Verified Sellers</h2>
          <p className="text-3xl font-bold text-green-600">18</p>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-xl p-4">
        <h2 className="text-lg font-bold mb-4">Daftar Seller</h2>
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">Nama</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(3)].map((_, i) => (
              <tr key={i} className="border-b">
                <td className="px-4 py-2">Seller {i + 1}</td>
                <td className="px-4 py-2">seller{i + 1}@email.com</td>
                <td className="px-4 py-2 text-yellow-600">Pending</td>
                <td className="px-4 py-2">
                  <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                    Verifikasi
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminDashboard