'use client'

import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { id } from 'date-fns/locale/id'
import { CalendarEvent } from '@/types/calendarEvents'
import { useState } from 'react'
import { Booking } from '@/types/booking'
import { useRouter } from 'next/navigation'

const locales = { 'id': id }

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
})

const BookingCalendar = ({ bookings, events }: { bookings: Booking[], events: CalendarEvent[] }) => {
  const router = useRouter()
  const [selectedDateBookings, setSelectedDateBookings] = useState<Booking[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleSelectEvent = (event: CalendarEvent) => {
    const clickedDate = new Date(event.start)
    const filtered = bookings.filter((b) => {
      const bookingDate = new Date(b.date)
      return (
        bookingDate.getFullYear() === clickedDate.getFullYear() &&
        bookingDate.getMonth() === clickedDate.getMonth() &&
        bookingDate.getDate() === clickedDate.getDate()
      )
    })

    setSelectedDateBookings(filtered)
    setIsModalOpen(true)
  }


  return (
    <div className="p-4">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectEvent={handleSelectEvent}
        style={{ height: 600 }}
        eventPropGetter={(event) => {
          let bgColor = '#3B82F6' // blue for pending
          if (event.status === 'confirmed') bgColor = '#10B981' // green
          if (event.status === 'cancelled') bgColor = '#EF4444' // red
          return { style: { backgroundColor: bgColor, color: 'white' } }
        }}
      />
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Keterangan Warna:</h2>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 bg-blue-500 rounded-sm border border-gray-400"></span>
            <span>Pending</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 bg-green-500 rounded-sm border border-gray-400"></span>
            <span>Confirmed</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 bg-red-500 rounded-sm border border-gray-400"></span>
            <span>Cancelled</span>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded p-6 max-w-xl w-full">
            <h2 className="text-lg font-bold mb-4">Booking pada tanggal tersebut</h2>
            {selectedDateBookings.length === 0 ? (
              <p>Tidak ada booking</p>
            ) : (
              <ul className="space-y-2">
                {selectedDateBookings.map((b) => (
                  <li key={b._id} className="border p-3 rounded shadow text-sm">
                    <p className="font-semibold">{b.packageId.title}</p>
                    <p>Status: <span className={`capitalize ${b.status === 'confirmed' ? 'text-green-600' : b.status === 'cancelled' ? 'text-red-600' : 'text-yellow-600'}`}>{b.status}</span></p>
                    <p>Jumlah orang: {b.numberOfPeople}</p>
                    <p>Catatan: {b.note || '-'}</p>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-4 flex justify-between gap-4">
              <button onClick={() => setIsModalOpen(false)} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Tutup
              </button>
                <button
                  onClick={() => router.push('/dashboard/seller/bookings')}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Lihat Semua Booking
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BookingCalendar
