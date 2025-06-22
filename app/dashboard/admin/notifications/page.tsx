'use client'

import { useEffect, useState } from 'react'
import { BellRing } from 'lucide-react'
import Link from 'next/link'
import { AdminNotification } from '@/types/adminNotifications'

const AdminNotifications = () => {
    const [notifications, setNotifications] = useState<AdminNotification[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchNotifications = async () => {
        const res = await fetch('/api/admin-notifications')
        const data = await res.json()
        setNotifications(data)
        setLoading(false)
        }

        fetchNotifications()
    }, [])

    if (loading) return <p className="text-center mt-8">Loading...</p>

    if (notifications.length === 0) {
        return <p className="text-center mt-8">Tidak ada notifikasi</p>
    }
  return (
    <div className="max-w-3xl mx-auto mt-8 px-4">
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <BellRing className="w-6 h-6" /> Notifikasi Admin
      </h1>

    <button
        onClick={async () => {
            const res = await fetch('/api/admin-notifications/mark-all-as-read', { method: 'PATCH' })
            if (res.ok) {
            // update state jika pakai useState
            setNotifications(prev =>
                prev.map(n => ({ ...n, isRead: true }))
            )
            // trigger update icon bell
            if (typeof window !== 'undefined') {
                const event = new CustomEvent('adminNotificationsRead')
                window.dispatchEvent(event)
            }
            }
        }}
        className="text-sm text-blue-600 underline mb-4"
        >
        Tandai semua sudah dibaca
        </button>
      <ul className="space-y-3">
        {notifications.map((notif) => (
          <li
            key={notif._id}
            className={`p-4 border rounded shadow-sm ${
              notif.isRead ? 'bg-white' : 'bg-blue-50'
            }`}
          >
            <p className="font-medium">{notif.message}</p>
            <p className="text-sm text-gray-500">{new Date(notif.createdAt).toLocaleString()}</p>
            {notif.packageId && (
              <Link
                href={`/dashboard/admin/packages`}
                className="text-blue-600 underline text-sm"
              >
                Lihat Paket
              </Link>
            )}
            {notif.sellerId && (
              <Link
                href={`/dashboard/admin/users`}
                className="text-blue-600 underline ml-4 text-sm"
              >
                Lihat Seller
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default AdminNotifications