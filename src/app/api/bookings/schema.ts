import { z } from 'zod'

const bookingStatusEnum = z.enum(['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'])

// Validates the optional ?studentId=/?tutorId=/?status= filters on
// GET /api/bookings (e.g. a student's dashboard uses ?studentId=..., a
// tutor's uses ?tutorId=...).
export const listQuerySchema = z.object({
  studentId: z.string().min(1).optional(),
  tutorId: z.string().min(1).optional(),
  status: bookingStatusEnum.optional(),
})

// Body shape for POST /api/bookings — a student booking a session. `status`
// isn't accepted here: every new booking starts PENDING (the schema
// default), the same way it always has in the UI's booking flow.
export const createBookingSchema = z.object({
  studentId: z.string().min(1, 'studentId is required'),
  tutorId: z.string().min(1, 'tutorId is required'),
  subject: z.string().min(1, 'subject is required'),
  // Accepts an ISO date string (what JSON.stringify(new Date()) produces on
  // the client) and turns it into a real Date for Prisma.
  date: z.coerce.date(),
})

// Fields editable after creation: studentId/tutorId identify *who* the
// booking is between and never change; subject/date/status can.
export const bookingEditSchema = z.object({
  subject: z.string().min(1),
  date: z.coerce.date(),
  status: bookingStatusEnum,
})
