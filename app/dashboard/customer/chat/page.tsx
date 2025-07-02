'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CustomerConversations } from '@/types/customerConversations'

const page = () => {

    const [conversations, setConversations] = useState<CustomerConversations[]>([])

    useEffect(() => {
        const fetchConversations = async () => {
        const res = await fetch('/api/message/customer-conversations')
        if (res.ok) {
            const data = await res.json()
            setConversations(data)
        }
        }

        fetchConversations()
    }, [])
  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Pesan Anda</h1>
      <ul className="space-y-3">
        {conversations.map((conv) => (
          <li key={conv.sellerId}>
            <Link
              href={`/dashboard/customer/chat/${conv.sellerId}`}
              className="block px-4 py-3 border rounded hover:bg-gray-50 relative"
            >
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold">{conv.sellerName}</p>
                  <p className="text-sm text-gray-600 truncate">{conv.latestMessage}</p>
                </div>
                {conv.unreadCount > 0 && (
                  <span className="bg-red-600 text-white text-xs font-bold rounded-full px-2 py-0.5 h-fit">
                    {conv.unreadCount}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-1">{new Date(conv.lastTime).toLocaleString()}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default page