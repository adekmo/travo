'use client'

import { useEffect, useState } from 'react'

const ActivityLogPage = () => {

    const [logs, setLogs] = useState([])

    useEffect(() => {
        const fetchLogs = async () => {
        const res = await fetch('/api/admin/activity-logs')
        const data = await res.json()
        setLogs(data)
        }

        fetchLogs()
    }, [])
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Riwayat Aktivitas Seller</h1>
      <ul className="space-y-4">
        {logs.map((log: any) => (
          <li key={log._id} className="border p-4 rounded shadow text-sm">
            <p><strong>Seller:</strong> {log.seller.name} ({log.seller.email})</p>
            <p><strong>Aksi:</strong> {log.action}</p>
            {log.packageId && <p><strong>Paket:</strong> {log.packageId.title}</p>}
            <p><strong>Pesan:</strong> {log.message}</p>
            <p className="text-gray-500 text-xs">{new Date(log.createdAt).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ActivityLogPage