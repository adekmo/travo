'use client'

import { useEffect, useState } from 'react'
import { BellRing } from 'lucide-react'
import { Notification } from '@/types/notification'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

const NotificationPage = () => {
    const { data: session } = useSession()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAndMark = async () => {
    if (!session?.user?.id) return

    // Ambil notifikasi
    const res = await fetch('/api/notifications')
    const data = await res.json()
    setNotifications(data)
    setLoading(false)
  }

  fetchAndMark()
}, [session])

  if (loading) return <p className="text-center mt-8">Loading...</p>

  if (notifications.length === 0) {
    return <p className="text-center mt-8">Tidak ada notifikasi</p>
  }

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <BellRing className="w-6 h-6" /> Notifikasi 
      </h1>
      <button
        onClick={async () => {
          if (!session?.user?.id) return

          const res = await fetch('/api/notifications/mark-all-as-read', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: session.user.id }),
          })

          if (res.ok) {
            // Fetch ulang notifikasi dari server (pastikan status isRead sudah update)
            const updatedRes = await fetch('/api/notifications')
            const updatedData = await updatedRes.json()
            setNotifications(updatedData)

            // Kirim event ke Navbar untuk update badge merah
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('notificationsRead'))
            }
          }
        }}
        className="text-sm text-blue-600 underline mb-2"
      >
        Tandai semua sudah dibaca
      </button>

      <ul className="space-y-3">
        {notifications.map((notif) => (
          <li key={notif._id} className={`p-4 border rounded ${notif.isRead ? 'bg-white' : 'bg-blue-50'}`}>
            <p>{notif.message}</p>
            <p className="text-sm text-gray-500">{new Date(notif.createdAt).toLocaleString()}</p>
            <Link 
              href={`/dashboard/seller/bookings`} 
              className='text-blue-600 underline' 
              onClick={async () => {
                await fetch('/api/notifications/mark-as-read-one', {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ notificationId: notif._id }),
                })
              }}
            >
              Lihat detail
            </Link>
          </li>
        ))}
      </ul>

    </div>
  )
}

export default NotificationPage
