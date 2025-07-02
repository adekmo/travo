'use client'

import { Bell, MessageSquare } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const NavbarCustomer = () => {
    const pathname = usePathname()
    const { data: session } = useSession()
    const [hasNotifUnread, setHasNotifUnread] = useState(false)
    const [hasChatUnread, setHasChatUnread] = useState(false)

    useEffect(() => {
      const checkNotifications = async () => {
        if (session?.user?.role === 'customer') {
          try {
            const res = await fetch('/api/bookings/customer/notifications')
            const data = await res.json()
            const unread = data.some((n: any) => !n.isRead)
            setHasNotifUnread(unread)
          } catch (err) {
            console.error('Gagal mengambil notifikasi customer')
          }
        }
      }

      checkNotifications()
      const interval = setInterval(checkNotifications, 5000)
      return () => clearInterval(interval)
    }, [session])

    useEffect(() => {
      const handleNotifRead = () => {
        setHasChatUnread(false)
      }

      window.addEventListener('notificationsRead', handleNotifRead)

      return () => {
        window.removeEventListener('notificationsRead', handleNotifRead)
      }
    }, [])

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-white shadow">
      <Link href="/packages" className="text-xl font-bold">Travoo</Link>

      <div className="flex items-center gap-6">
        {/* Tambahkan link profil/dll jika perlu */}
        <Link href="/dashboard/customer" className="text-blue-600 underline">
          Dashboard
        </Link>
        <Link href="/dashboard/customer/bookings" className="text-blue-600 underline">
          Booking
        </Link>
        <Link href="/dashboard/profile" className="text-blue-600 underline">
            <p>Profile</p>    
        </Link>
        <Link href="/dashboard/customer/wishlist" className="text-blue-600 underline mr-2">
          Wishlists
        </Link>

        <Link href="/dashboard/customer/chat" className={`relative text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 ${pathname.startsWith('/dashboard/customer/chat') ? 'text-blue-600 font-semibold' : ''}`}>
          <MessageSquare className="w-6 h-6 inline-block mr-1" />
          {hasChatUnread && (
            <>
              <span className="absolute -top-1.5 -right-1.5 block h-2 w-2 bg-red-600 rounded-full animate-ping"></span>
              <span className="absolute -top-1.5 -right-1.5 block h-2 w-2 bg-red-600 rounded-full"></span>
            </>
          )}
        </Link>

        <Link href="/dashboard/customer/notifications" className="relative">
          <Bell className="w-6 h-6 text-gray-700 hover:text-blue-600 transition" />
          {hasNotifUnread && (
            <>
              <span className="absolute top-0 right-0 block w-2 h-2 bg-red-600 rounded-full animate-ping"></span>
              <span className="absolute top-0 right-0 block w-2 h-2 bg-red-600 rounded-full"></span>
            </>
          )}
        </Link>
      </div>
    </nav>
  )
}

export default NavbarCustomer