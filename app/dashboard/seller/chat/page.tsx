'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface MessageUser {
  _id: string
  name: string
}

const SellerChatListPage = () => {
    const [users, setUsers] = useState<MessageUser[]>([])

    useEffect(() => {
        const fetchChatUsers = async () => {
            const res = await fetch('/api/message/chat-users')
            if (res.ok) {
                const data = await res.json()
                setUsers(data)
            }
        }

        fetchChatUsers()
    }, [])
  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Pesan Masuk</h1>
      <ul className="space-y-3">
        {users.map((user) => (
          <li key={user._id}>
            <Link
              href={`/dashboard/seller/chat/${user._id}`}
              className="block px-4 py-2 border rounded hover:bg-gray-100"
            >
              {user.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default SellerChatListPage