'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Conversations } from '@/types/conversations'


const SellerChatListPage = () => {
    const [conversations, setConversations] = useState<Conversations[]>([])

    useEffect(() => {
        const fetchChatUsers = async () => {
            const res = await fetch('/api/message/conversations')
            if (res.ok) {
                const data = await res.json()
                setConversations(data)
            }
        }

        fetchChatUsers()
    }, [])
  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Pesan Masuk</h1>

      {conversations.length === 0 ? (
        <p className="text-gray-500">Belum ada pesan masuk.</p>
      ) : (
        <ul className="space-y-3">
          {conversations.map((conv) => (
            <li key={conv.customerId}>
              <Link
                href={`/dashboard/seller/chat/${conv.customerId}`}
                className="block px-4 py-2 border rounded hover:bg-gray-100 relative"
              >
                <div className="font-semibold">{conv.customerName}</div>
                <div className="text-gray-600 text-sm truncate">{conv.latestMessage}</div>
                <div className="text-xs text-gray-400">
                  {new Date(conv.lastTime).toLocaleString()}
                </div>

                {conv.unreadCount > 0 && (
                  <span className="absolute top-2 right-3 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                    {conv.unreadCount}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default SellerChatListPage