'use client'

import { Bell } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

const Navbar = () => {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [hasUnread, setHasUnread] = useState(false)

   useEffect(() => {
      const fetchUnreadStatus = async () => {
        if (session?.user?.role === 'seller') {
          try {
            const res = await fetch('/api/notifications')
            const data = await res.json()
            const unreadExists = data.some((notif: any) => !notif.isRead)
            setHasUnread(unreadExists)
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

        {pathname.includes('/dashboard/seller') && (
          <Link href="/dashboard/seller/notifications" className="relative">
            <Bell className="w-6 h-6 text-gray-700 hover:text-blue-600 transition" />
            {hasUnread && (
              <span className="absolute top-0 right-0 block w-2 h-2 bg-red-600 rounded-full animate-ping"></span>
            )}
            {hasUnread && (
              <span className="absolute top-0 right-0 block w-2 h-2 bg-red-600 rounded-full"></span>
            )}
          </Link>
        )}
      </div>
    </nav>
  )
}

export default Navbar
