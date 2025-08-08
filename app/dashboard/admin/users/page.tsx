'use client'

import { User } from '@/types/user';
import { useEffect, useState } from 'react'

const UserList = () => {

    const [users, setUsers] = useState<User[]>([]);
    const [filterRole, setFilterRole] = useState<string>('');
    const [filterVerified, setFilterVerified] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState<string>('');

    useEffect(() => {
        const fetchUsers = async () => {
          let url = '/api/admin/users';
          const params: string[] = [];

          if (filterRole) params.push(`role=${filterRole}`);
          if (filterVerified) params.push(`isVerified=${filterVerified}`);
          if (searchTerm) params.push(`search=${searchTerm}`);

          if (params.length > 0) {
            url = `${url}?${params.join('&')}`;
          }
          const res = await fetch(url);
          const data = await res.json()
          setUsers(data)
        }

        fetchUsers()
    }, [filterRole, filterVerified, searchTerm])

    const handleVerify = async (id: string) => {
        const res = await fetch(`/api/admin/users/${id}/verify`, {
            method: "PATCH",
            cache: 'no-store',
        });

        // const data = await res.json();

        if (res.ok) {
            // Refresh data setelah verifikasi berhasil
            setUsers((prev) =>
                prev.map((u) =>
                    u._id === id ? { ...u, isVerified: true } : u
                )
            );
        } else {
            alert("Gagal memverifikasi user");
        }
    };

    const handleToggleBlock = async (id: string, currentStatus: boolean) => {
      const res = await fetch(`/api/admin/users/${id}/block`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isBlocked: !currentStatus }),
    });

    if (res.ok) {
      const updatedUser = await res.json();
      setUsers((prev) =>
        prev.map((u) =>
          u._id === id ? { ...u, isBlocked: updatedUser.isBlocked } : u
        )
      );
    } else {
      alert("Gagal mengubah status blokir");
    }
  };


  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manajemen User</h1>
      {/* Filter and Search */}
      <div className="mb-4 flex space-x-4">
        <input
          type="text"
          placeholder="Cari User"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded"
        />
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">Semua Role</option>
          <option value="admin">Admin</option>
          <option value="seller">Seller</option>
          <option value="customer">Customer</option>
        </select>
        <select
          value={filterVerified}
          onChange={(e) => setFilterVerified(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">Semua Status</option>
          <option value="true">Terverifikasi</option>
          <option value="false">Belum Terverifikasi</option>
        </select>
      </div>
      <table className="min-w-full bg-white rounded shadow">
        <thead>
          <tr>
            <th className="p-3 text-left">Nama</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Role</th>
            <th className="p-3 text-left">Verifikasi</th>
            <th className="p-3 text-left">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="border-t">
              <td className="p-3">{user.name}</td>
              <td className="p-3">{user.email}</td>
              <td className="p-3">{user.role}</td>
              <td className="p-3">{user.isVerified ? 'Terverifikasi' : 'Belum'}</td>
              <td className="p-3">
                {!user.isVerified && user.role === 'seller' && (
                  <button onClick={() => handleVerify(user._id)} className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">
                    Verifikasi
                  </button>
                )}
                {user.role !== 'admin' && (
                  <button
                    onClick={() => handleToggleBlock(user._id, user.isBlocked)}
                    className={`px-3 py-1 rounded text-sm text-white ${user.isBlocked ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}
                  >
                    {user.isBlocked ? 'Buka Blokir' : 'Blokir'}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default UserList