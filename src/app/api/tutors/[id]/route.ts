import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ok, fail, handlePrismaError } from '@/lib/apiResponse'
import { tutorEditSchema } from '../../schemas/tutors.schema'
import { tutorInclude, withSessionsCount } from '../helpers'

// Next.js passes dynamic segments (the `[id]` in the folder name) as a
// Promise you have to `await` — see
// node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/route.md
type RouteContext = { params: Promise<{ id: string }> }

// GET /api/tutors/:id — one tutor's full profile
export async function GET(_request: NextRequest, { params }: RouteContext) {
  const { id } = await params

  const tutor = await prisma.tutorProfile.findUnique({
    where: { id },
    include: tutorInclude,
  })

  if (!tutor) return fail(404, 'Tutor not found')
  return ok(withSessionsCount(tutor))
}

// PUT /api/tutors/:id — full replace of the editable fields (see
// tutorEditSchema in ../../schemas/tutors.schema.ts). Every field is required: this is meant
// for "save the whole edited profile form", not a single-field tweak —
// that's what PATCH below is for.
export async function PUT(request: NextRequest, { params }: RouteContext) {
  const { id } = await params
  const body = await request.json()

  const parsed = tutorEditSchema.safeParse(body)
  if (!parsed.success) {
    return fail(400, 'Invalid request', parsed.error.flatten())
  }

  try {
    const tutor = await prisma.tutorProfile.update({
      where: { id },
      data: parsed.data,
      include: tutorInclude,
    })
    return ok(withSessionsCount(tutor))
  } catch (error) {
    return handlePrismaError(error)
  }
}

// PATCH /api/tutors/:id — partial update: send only the field(s) you want
// to change, e.g. { "verified": true } from an admin's approve button.
export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const { id } = await params
  const body = await request.json()

  // .partial() is zod's built-in way to make every field on an existing
  // schema optional, so callers can send just one field.
  const parsed = tutorEditSchema.partial().safeParse(body)
  if (!parsed.success) {
    return fail(400, 'Invalid request', parsed.error.flatten())
  }

  try {
    const tutor = await prisma.tutorProfile.update({
      where: { id },
      data: parsed.data,
      include: tutorInclude,
    })
    return ok(withSessionsCount(tutor))
  } catch (error) {
    return handlePrismaError(error)
  }
}

// DELETE /api/tutors/:id
export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  const { id } = await params

  try {
    await prisma.tutorProfile.delete({ where: { id } })
    return ok(null, 'Tutor deleted')
  } catch (error) {
    return handlePrismaError(error)
  }
}
