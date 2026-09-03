import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ok, fail, handlePrismaError } from '@/lib/apiResponse'
import { applicationEditSchema, isDecided } from '../../schemas/applications.schema'

// Next.js passes dynamic segments (the `[id]` in the folder name) as a
// Promise you have to `await` — see
// node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/route.md
type RouteContext = { params: Promise<{ id: string }> }

// GET /api/applications/:id
export async function GET(_request: NextRequest, { params }: RouteContext) {
  const { id } = await params

  const application = await prisma.tutorApplication.findUnique({
    where: { id },
    include: { tutor: true },
  })

  if (!application) return fail(404, 'Application not found')
  return ok(application)
}

// PUT /api/applications/:id — full replace: status, documents and aiScore
// are all required (see applicationEditSchema in ../../schemas/applications.schema.ts).
//
// `reviewedAt` is stamped automatically here rather than trusted from the
// client: the moment status moves to a decided state (APPROVED/REJECTED) we
// set it to now, and if it moves back to an open state (e.g. an admin
// undoes a rejection) we clear it back to null.
export async function PUT(request: NextRequest, { params }: RouteContext) {
  const { id } = await params
  const body = await request.json()

  const parsed = applicationEditSchema.safeParse(body)
  if (!parsed.success) {
    return fail(400, 'Invalid request', parsed.error.flatten())
  }

  try {
    const application = await prisma.tutorApplication.update({
      where: { id },
      data: {
        ...parsed.data,
        reviewedAt: isDecided(parsed.data.status) ? new Date() : null,
      },
    })
    return ok(application)
  } catch (error) {
    return handlePrismaError(error)
  }
}

// PATCH /api/applications/:id — partial update. This is what the admin
// "approve"/"reject" buttons will call, e.g. body: { "status": "APPROVED" }.
export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const { id } = await params
  const body = await request.json()

  // .partial() is zod's built-in way to make every field on an existing
  // schema optional, so callers can send just the one field they're
  // changing.
  const parsed = applicationEditSchema.partial().safeParse(body)
  if (!parsed.success) {
    return fail(400, 'Invalid request', parsed.error.flatten())
  }

  try {
    const application = await prisma.tutorApplication.update({
      where: { id },
      data: {
        ...parsed.data,
        // Only touch reviewedAt if this particular request is changing
        // status at all — a PATCH that only updates `documents`, say,
        // shouldn't silently reset the review timestamp.
        ...(parsed.data.status
          ? { reviewedAt: isDecided(parsed.data.status) ? new Date() : null }
          : {}),
      },
    })
    return ok(application)
  } catch (error) {
    return handlePrismaError(error)
  }
}

// DELETE /api/applications/:id
export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  const { id } = await params

  try {
    await prisma.tutorApplication.delete({ where: { id } })
    return ok(null, 'Application deleted')
  } catch (error) {
    return handlePrismaError(error)
  }
}
