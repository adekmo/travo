'use client'

import { useEffect, useState } from 'react'

import BookingCalendar from '@/components/BookingCalendar'
import SellerCharts from '@/components/SellerCharts'
import SellerReviewList from '@/components/SellerReviewList'
import SellerStats from '@/components/SellerStats'
import React from 'react'
import { Booking } from '@/types/booking'

const SellerDashboardPage = () => {
  const [events, setEvents] = useState([])
  const [bookings, setBookings] = useState([])

  useEffect(() => {
    const fetchBookings = async () => {
      const res = await fetch('/api/bookings/seller')
      const data = await res.json()

      const mapped = data.map((booking: Booking) => ({
        title: `${booking.packageId.title} (${booking.numberOfPeople} org)`,
        start: new Date(booking.date),
        end: new Date(booking.date),
        status: booking.status,
      }))

      setEvents(mapped)
      setBookings(data) // <- tambahkan ini
    }

    fetchBookings()
  }, [])
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Dashboard Seller</h1>
      <div>
        <SellerStats />
      </div>
      <div>
        <BookingCalendar bookings={bookings} events={events} />
      </div>
      <div>
        <SellerReviewList limit={5} showSeeMore />
      </div>
      <div>
        <SellerCharts />
      </div>
    </div>
  )
}

export default SellerDashboardPage