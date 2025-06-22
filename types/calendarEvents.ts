export type CalendarEvent = {
  title: string
  start: Date
  end: Date
  status: 'pending' | 'confirmed' | 'cancelled'
}
