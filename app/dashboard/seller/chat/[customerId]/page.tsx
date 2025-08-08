'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { Message } from '@/types/message'

const SellerChatPage = () => {
  const { customerId } = useParams()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const chatEndRef = useRef<HTMLDivElement>(null)

    const fetchMessages = useCallback(async () => {
      const res = await fetch(`/api/message/${customerId}`)
      if (res.ok) {
        const data = await res.json()
        setMessages(data)
      }
    }, [customerId])

    useEffect(() => {
      fetchMessages()
      // const interval = setInterval(fetchMessages, 3000)
      // return () => clearInterval(interval)
    }, [fetchMessages])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    const markAsRead = async () => {
      await fetch(`/api/message/read/${customerId}`, { method: 'POST' })
    }

    markAsRead()
  }, [customerId])

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return

    const res = await fetch('/api/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        receiverId: customerId,
        message: newMessage,
      }),
    })

    if (res.ok) {
      setNewMessage('')
      fetchMessages()
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Chat dengan Customer</h1>

      <div className="border rounded p-4 h-[400px] overflow-y-auto mb-4 bg-gray-50">
        {messages.map((msg) => (
          <div key={msg._id} className="mb-3">
            <p className="text-sm text-gray-600">
              <strong>{msg.senderId.name}</strong> • {new Date(msg.createdAt).toLocaleTimeString()}
            </p>
            <p className="text-gray-800">{msg.message}</p>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Ketik pesan..."
          className="flex-1 border px-3 py-2 rounded"
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Kirim
        </button>
      </div>
    </div>
  )
}

export default SellerChatPage
