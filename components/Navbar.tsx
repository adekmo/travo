'use client'

import { Bell, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'


const Navbar = () => {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [hasNotifUnread, setHasNotifUnread] = useState(false)
  const [hasChatUnread, setHasChatUnread] = useState(false)

   useEffect(() => {
      const fetchUnreadStatus = async () => {
        if (session?.user?.role === 'seller') {
          try {
            // Notifikasi umum
            const notifRes = await fetch('/api/notifications')
            const notifData = await notifRes.json()
            const notifUnread = notifData.some((n: any) => !n.isRead)
            setHasNotifUnread(notifUnread)

            // Notifikasi chat
            const chatRes = await fetch('/api/message/conversations')
            const chatData = await chatRes.json()
            const chatUnread = chatData.some((c: any) => c.unreadCount > 0)
            setHasChatUnread(chatUnread)

          } catch (error) {
            console.error('Gagal mengambil notifikasi')
          }
        }
      }

      // Jalankan sekali saat mount & ketika pathname berubah
      fetchUnreadStatus()

      // Update ulang saat notifikasi ditandai dibaca dari halaman notif
      const handleRead = () => fetchUnreadStatus()
      window.addEventListener('notificationsRead', handleRead)

      return () => {
        window.removeEventListener('notificationsRead', handleRead)
      }
    }, [session, pathname])

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-white shadow">
      <Link href="/" className="text-xl font-bold">Travoo</Link>

      <div className="flex items-center gap-6">
        {/* Tambahkan link profil/dll jika perlu */}
        <Link href="/dashboard/seller" className="text-blue-600 underline">
          Dashboard
        </Link>
        <Link href="/dashboard/seller/packages" className="text-blue-600 underline">
          Packages
        </Link>
        <Link href="/dashboard/seller/bookings" className="text-blue-600 underline">
          Booking
        </Link>
        <Link href="/dashboard/profile" className="text-blue-600 underline">
            <p>Profile</p>    
        </Link>

        <Link href="/dashboard/seller/chat" className={`relative text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 ${pathname.startsWith('/dashboard/seller/chat') ? 'text-blue-600 font-semibold' : ''}`}>
          <MessageSquare className="w-6 h-6 inline-block mr-1" /> {/* Menggunakan ikon chat */}
          {hasChatUnread && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-2 w-2 flex items-center justify-center animate-bounce-once">
              {hasChatUnread}
            </span>
          )}
        </Link>

        {pathname.includes('/dashboard/seller') && (
          <Link href="/dashboard/seller/notifications" className="relative">
            <Bell className="w-6 h-6 text-gray-700 hover:text-blue-600 transition" />
            {hasNotifUnread  && (
              <span className="absolute top-0 right-0 block w-2 h-2 bg-red-600 rounded-full animate-ping"></span>
            )}
            {hasNotifUnread  && (
              <span className="absolute top-0 right-0 block w-2 h-2 bg-red-600 rounded-full"></span>
            )}
          </Link>
        )}
      </div>
    </nav>
  )
}

export default Navbar
