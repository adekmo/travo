'use client'

import { Notification } from '@/types/notification'
import { useEffect, useState } from 'react'

const CustomerNotificationPage  = () => {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [loading, setLoading] = useState(true)

    const fetchNotifications = async () => {
        try {
            const res = await fetch('/api/bookings/customer/notifications')
            const data = await res.json()
            setNotifications(data)
        } catch (error) {
            console.error('Gagal mengambil notifikasi', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchNotifications()
    }, [])

    const handleMarkAllAsRead = async () => {
        try {
        const res = await fetch('/api/bookings/customer/notifications/read', {
            method: 'PATCH',
        })
        if (res.ok) {
            fetchNotifications()
            window.dispatchEvent(new Event('notificationsRead')) // update navbar
        }
        } catch (error) {
        console.error('Gagal menandai notifikasi sebagai dibaca', error)
        }
    }
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Notifikasi</h1>

      {notifications.length > 0 && (
        <button
          onClick={handleMarkAllAsRead}
          className="mb-4 text-sm text-blue-600 underline"
        >
          Tandai semua dibaca
        </button>
      )}

      {loading ? (
        <p>Memuat notifikasi...</p>
      ) : notifications.length === 0 ? (
        <p>Tidak ada notifikasi</p>
      ) : (
        <ul className="space-y-3">
          {notifications.map((notif) => (
            <li
              key={notif._id}
              className={`border px-4 py-3 rounded ${
                notif.isRead ? 'bg-gray-100' : 'bg-white'
              }`}
            >
              <p className="text-gray-800">{notif.message}</p>
              <p className="text-xs text-gray-500">
                {new Date(notif.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default CustomerNotificationPage 