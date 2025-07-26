'use client'

import { Bell, MapPlusIcon, MessageSquare, UserCircleIcon } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/Avatar'

const MainNavbar = () => {

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

            const chatRes = await fetch('/api/message/customer-conversations') 
            const chatData = await chatRes.json()
            const chatUnread = chatData.some((c: any) => c.unreadCount > 0)
            setHasChatUnread(chatUnread)
          } catch (err) {
            console.error('Gagal mengambil notifikasi customer')
          }
        } else if(session?.user?.role === 'seller') {
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
            console.error('Gagal mengambil notifikasi seller')
          }
        } else if(session?.user?.role === 'admin') {
            try {
                const res = await fetch('/api/admin-notifications')
                const data = await res.json()
                const unreadExists =  (data.notifications || []).some((n: { isRead: any }) => !n.isRead)
                setHasNotifUnread(unreadExists)
            } catch (error) {
                console.error('Gagal mengambil notifikasi Admin')
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

    const handleLogout = async () => {
        await signOut({ callbackUrl: '/' });
    };

  if(session?.user?.role === "admin") {
    return (
        <nav className="flex justify-between items-center px-6 py-4 bg-white shadow">
            <Link href="/packages" className="flex items-center gap-3 group">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-2.5 shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
                <MapPlusIcon className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Travoo
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium -mt-1">
                  Travel Marketplace
                </span>
              </div>
            </Link>
      
      <div className="flex items-center gap-6">
        {/* <Link href="/dashboard/admin" className="text-blue-600 underline">
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
        </Link> */}
        <Link href="/dashboard/admin/notifications" className="relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105">
          <Bell className="w-6 h-6 text-gray-700 hover:text-blue-600 transition" />
          {hasNotifUnread && (
            <>
              <span className="absolute top-0 right-0 block w-2 h-2 bg-red-600 rounded-full animate-ping" />
              <span className="absolute top-0 right-0 block w-2 h-2 bg-red-600 rounded-full" />
            </>
          )}
        </Link>
        {session ? (
                    <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105">
                        <p className="ml-1">Logout</p>
                    </button>
                ) : (
                    <Link href="/auth/signin" className="flex items-center">
                        <p className="ml-1">Sign-In</p>
                    </Link>
                )}
      </div>
    </nav>
    )
  } else if(session?.user?.role === 'seller'){
    return (
        <nav className="flex justify-between items-center px-6 py-4 bg-white shadow">
            <Link href="/packages" className="flex items-center gap-3 group">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-2.5 shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
                <MapPlusIcon className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Travoo
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium -mt-1">
                  Travel Marketplace
                </span>
              </div>
            </Link>

            <div className="flex items-center gap-6">
                {/* <Link href="/dashboard/seller" className="text-blue-600 underline">
                    Dashboard
                </Link>
                <Link href="/dashboard/seller/packages" className="text-blue-600 underline">
                    Packages
                </Link>
                <Link href="/dashboard/seller/bookings" className="text-blue-600 underline">
                    Booking
                </Link>
                <Link href="/dashboard/profile" className="text-blue-600 underline">
                    <p>Profile {session.user.name}</p>    
                </Link> */}
                <Link href="/stories" className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105">
                      <p className="ml-1">Story Perjalan</p>
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
                    <Link href="/dashboard/seller/notifications" className="relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105">
                        <Bell className="w-6 h-6 text-gray-700 hover:text-blue-600 transition" />
                        {hasNotifUnread  && (
                        <span className="absolute top-0 right-0 block w-2 h-2 bg-red-600 rounded-full animate-ping"></span>
                        )}
                        {hasNotifUnread  && (
                        <span className="absolute top-0 right-0 block w-2 h-2 bg-red-600 rounded-full"></span>
                        )}
                    </Link>
                )}

                {session ? (
                    <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105">
                        <p className="ml-1">Logout</p>
                    </button>
                ) : (
                    <Link href="/auth/signin" className="flex items-center">
                        <p className="ml-1">Sign-In</p>
                    </Link>
                )}
                </div>
            </nav>
    )
  } else if(session?.user?.role === 'customer'){
    return (
        <nav className="flex justify-between items-center px-6 py-4 bg-white shadow">
            <Link href="/packages" className="flex items-center gap-3 group">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-2.5 shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
                <MapPlusIcon className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Travoo
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium -mt-1">
                  Travel Marketplace
                </span>
              </div>
            </Link>
                    <div className="flex items-center gap-6">
                        {/* <Link href="/dashboard/customer" className="text-blue-600 underline">
                            Dashboard
                        </Link>
                        <Link href="/dashboard/customer/bookings" className="text-blue-600 underline">
                            Booking
                        </Link>
                        <Link href="/dashboard/customer/wishlist" className="text-blue-600 underline mr-2">
                            Wishlists
                        </Link> */}
                        <Link href="/stories" className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105">
                          <p className="ml-1">Story Perjalan</p>
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

                        <Link href="/dashboard/customer/notifications" className="realtive flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105">
                            <Bell className="w-6 h-6 text-gray-700 hover:text-blue-600 transition" />
                            {hasNotifUnread && (
                                <>
                                <span className="absolute top-0 right-0 block w-2 h-2 bg-red-600 rounded-full animate-ping"></span>
                                <span className="absolute top-0 right-0 block w-2 h-2 bg-red-600 rounded-full"></span>
                                </>
                            )}
                        </Link>

                        <Link href="/dashboard/customer" className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105">
                          {/* <UserCircleIcon className="w-6 h-6 text-gray-700 hover:text-blue-600 transition " /> */}
                          <Avatar className="h-10 w-10 flex-shrink-0">
                            <AvatarImage src={session.user.avatar} alt={session.user.name} />
                            <AvatarFallback>{session.user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                            <p className="text-gray-700">{session.user.name}</p>    
                        </Link> 
                        {session ? (
                            <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105">
                                <p className="ml-1">Logout</p>
                            </button>
                        ) : (
                            <Link href="/auth/signin" className="flex items-center">
                                <p className="ml-1">Sign-In</p>
                            </Link>
                        )}
                    </div>
        </nav>
    )
  } else{
    return (
        <nav className="flex justify-between items-center px-6 py-4 bg-white shadow">
            <Link href="/packages" className="flex items-center gap-3 group">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-2.5 shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
                <MapPlusIcon className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Travoo
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium -mt-1">
                  Travel Marketplace
                </span>
              </div>
            </Link>
                <div className="flex items-center gap-6">
                    <Link href="/stories" className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105">
                         <p className="ml-1">Story Perjalan</p>
                    </Link>
                    <Link href="/auth/signin" className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105">
                         <p className="ml-1">Sign-In / Sign-Up</p>
                    </Link>
                </div>
        </nav>
    )
  }
}

export default MainNavbar