import type { Prisma } from '@prisma/client'
import type { z } from 'zod'
import { createBookingSchema, bookingEditSchema } from '@/app/api/schemas/bookings.schema'

// Matches `bookingInclude` in src/app/api/bookings/route.ts.
export type Booking = Prisma.BookingGetPayload<{
  include: { student: true; tutor: true }
}>

export type CreateBookingDto = z.infer<typeof createBookingSchema>
export type BookingEditDto = z.infer<typeof bookingEditSchema>
