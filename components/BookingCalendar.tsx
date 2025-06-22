'use client'

import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { id } from 'date-fns/locale/id'
import { CalendarEvent } from '@/types/calendarEvents'

const locales = { 'id': id }

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
})

const BookingCalendar = ({ events }: { events: CalendarEvent[] }) => {
  return (
    <div className="p-4">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
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
    </div>
  )
}

export default BookingCalendar
