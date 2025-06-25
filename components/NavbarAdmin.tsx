'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Bell } from 'lucide-react'
import { useEffect, useState } from 'react'


const NavbarAdmin = () => {

    const pathname = usePathname()
    const [hasUnread, setHasUnread] = useState(false)

    useEffect(() => {
        const fetchUnread = async () => {
            const res = await fetch('/api/admin-notifications')
            const data = await res.json()
            const unreadExists =  (data.notifications || []).some((n: { isRead: any }) => !n.isRead)
            setHasUnread(unreadExists)
        }

        const handleRead = () => fetchUnread()

        fetchUnread()
        window.addEventListener('adminNotificationsRead', handleRead)

        return () => {
            window.removeEventListener('adminNotificationsRead', handleRead)
        }
    }, [pathname])

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-white shadow">
      <Link href="/" className="text-xl font-bold">Travoo Admin</Link>
      
      <div className="flex items-center gap-6">
        <Link href="/dashboard/admin" className="text-blue-600 underline">
          Dashboard
        </Link>
        <Link href="/dashboard/admin/bookings" className="text-blue-600 underline">
          Bookings
        </Link>
        <Link href="/dashboard/admin/users" className="text-blue-600 underline">
          Users
        </Link>
        <Link href="/dashboard/admin/reviews" className="text-blue-600 underline">
          Reviews
        </Link>
        <Link href="/dashboard/admin/activity" className="text-blue-600 underline">
          Activity Logs
        </Link>
        <Link href="/dashboard/admin/notifications" className="relative">
          <Bell className="w-6 h-6 text-gray-700 hover:text-blue-600 transition" />
          {hasUnread && (
            <>
              <span className="absolute top-0 right-0 block w-2 h-2 bg-red-600 rounded-full animate-ping" />
              <span className="absolute top-0 right-0 block w-2 h-2 bg-red-600 rounded-full" />
            </>
          )}
        </Link>
      </div>
    </nav>
  )
}

export default NavbarAdmin