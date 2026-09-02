import { createResourceHooks } from './createResourceHooks'
import type { Booking, CreateBookingDto, BookingEditDto } from '@/interfaces/booking'

export type { Booking, CreateBookingDto, BookingEditDto }

export const {
  /** GET /api/bookings — e.g. useBookings({ studentId }) or
   * useBookings({ tutorId }) for the two dashboard views */
  useList: useBookings,
  /** GET /api/bookings/:id */
  useOne: useBooking,
  /** POST /api/bookings */
  useCreate: useCreateBooking,
  /** PUT /api/bookings/:id */
  useUpdate: useUpdateBooking,
  /** PATCH /api/bookings/:id — e.g. { status: 'CONFIRMED' } */
  usePatch: usePatchBooking,
  /** DELETE /api/bookings/:id */
  useDelete: useDeleteBooking,
} = createResourceHooks<Booking, CreateBookingDto, BookingEditDto>({
  basePath: 'bookings',
  queryKey: 'bookings',
})
