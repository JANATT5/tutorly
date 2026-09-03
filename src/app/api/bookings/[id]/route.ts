import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ok, fail, handlePrismaError } from '@/lib/apiResponse'
import { bookingEditSchema } from '../../schemas/bookings.schema'

type RouteContext = { params: Promise<{ id: string }> }

const bookingInclude = { student: true, tutor: true } as const

// GET /api/bookings/:id
export async function GET(_request: NextRequest, { params }: RouteContext) {
  const { id } = await params

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: bookingInclude,
  })

  if (!booking) return fail(404, 'Booking not found')
  return ok(booking)
}

// PUT /api/bookings/:id — full replace of subject/date/status
export async function PUT(request: NextRequest, { params }: RouteContext) {
  const { id } = await params
  const body = await request.json()

  const parsed = bookingEditSchema.safeParse(body)
  if (!parsed.success) {
    return fail(400, 'Invalid request', parsed.error.flatten())
  }

  try {
    const booking = await prisma.booking.update({
      where: { id },
      data: parsed.data,
      include: bookingInclude,
    })
    return ok(booking)
  } catch (error) {
    return handlePrismaError(error)
  }
}

// PATCH /api/bookings/:id — partial update. This is what a tutor/admin's
// "confirm" / "complete" / "cancel" buttons call, e.g. { "status": "CONFIRMED" }.
export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const { id } = await params
  const body = await request.json()

  const parsed = bookingEditSchema.partial().safeParse(body)
  if (!parsed.success) {
    return fail(400, 'Invalid request', parsed.error.flatten())
  }

  try {
    const booking = await prisma.booking.update({
      where: { id },
      data: parsed.data,
      include: bookingInclude,
    })
    return ok(booking)
  } catch (error) {
    return handlePrismaError(error)
  }
}

// DELETE /api/bookings/:id
export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  const { id } = await params

  try {
    await prisma.booking.delete({ where: { id } })
    return ok(null, 'Booking deleted')
  } catch (error) {
    return handlePrismaError(error)
  }
}
