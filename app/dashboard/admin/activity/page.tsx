'use client'

import { useEffect, useState } from 'react'
import { DateRange, RangeKeyDict } from 'react-date-range'
import { addDays, format } from 'date-fns'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'

const ActivityLogPage = () => {

    const [range, setRange] = useState([
      {
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection',
      },
    ])

    const [logs, setLogs] = useState<any[]>([])
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    useEffect(() => {
        const fetchLogs = async () => {
          const start = range[0].startDate.toISOString()
          const end = range[0].endDate.toISOString()
          const res = await fetch(`/api/admin/activity-logs?start=${start}&end=${end}&page=${page}&limit=5`)
          const result = await res.json()
          setLogs(result.logs || [])
          setTotalPages(result.totalPages || 1)
        }

        fetchLogs()
    }, [range, page])
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Riwayat Aktivitas Seller</h1>
      <div className="mb-4">
        <p className="font-semibold mb-2">Filter Tanggal:</p>
        <DateRange
          editableDateInputs={true}
          onChange={(ranges: RangeKeyDict) => {
            const {  startDate, endDate, key = 'selection' } = ranges.selection;
            if (startDate && endDate) {
              setRange([{ startDate, endDate, key }]);
            }
          }}
          moveRangeOnFirstSelection={false}
          ranges={range}
        />
      </div>
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

        <div className="mt-6 flex items-center justify-between">
          <button
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
            className={`px-4 py-2 rounded ${page === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
          >
            Sebelumnya
          </button>

          <span className="text-sm text-gray-700">
            Halaman {page} dari {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((prev) => prev + 1)}
            className={`px-4 py-2 rounded ${page === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
          >
            Berikutnya
          </button>
        </div>
    </div>
  )
}

export default ActivityLogPage