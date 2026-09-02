import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ok, created, fail, handlePrismaError } from '@/lib/apiResponse'
import { listQuerySchema, createBookingSchema } from './schema'

// What every /api/bookings response includes: the related student and tutor
// records, so a dashboard can render "Booking with <tutor name>" without a
// second request per row.
const bookingInclude = { student: true, tutor: true } as const

// GET /api/bookings — list bookings, optionally filtered by ?studentId=,
// ?tutorId= and/or ?status=. This is how the student/tutor dashboards will
// ask for "just my bookings".
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams

  const parsed = listQuerySchema.safeParse({
    studentId: params.get('studentId') ?? undefined,
    tutorId: params.get('tutorId') ?? undefined,
    status: params.get('status') ?? undefined,
  })

  if (!parsed.success) {
    return fail(400, 'Invalid filter', parsed.error.flatten())
  }

  const bookings = await prisma.booking.findMany({
    where: parsed.data,
    include: bookingInclude,
    orderBy: { date: 'desc' },
  })

  return ok(bookings)
}

// POST /api/bookings — a student books a session with a tutor
export async function POST(request: NextRequest) {
  const body = await request.json()

  const parsed = createBookingSchema.safeParse(body)
  if (!parsed.success) {
    return fail(400, 'Invalid request', parsed.error.flatten())
  }

  try {
    const booking = await prisma.booking.create({
      data: parsed.data,
      include: bookingInclude,
    })
    return created(booking)
  } catch (error) {
    // Most likely cause here: studentId or tutorId doesn't point to a real
    // profile — handlePrismaError turns that into a clean 400.
    return handlePrismaError(error)
  }
}
