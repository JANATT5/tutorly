import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ok, fail, handlePrismaError } from '@/lib/apiResponse'
import { subjectSchema } from '../../schemas/subjects.schema'

type RouteContext = { params: Promise<{ id: string }> }

// GET /api/subjects/:id
export async function GET(_request: NextRequest, { params }: RouteContext) {
  const { id } = await params

  const subject = await prisma.subject.findUnique({ where: { id } })

  if (!subject) return fail(404, 'Subject not found')
  return ok(subject)
}

// PUT /api/subjects/:id — full replace (same as PATCH here since there's
// only one editable field, but kept for a consistent 5-method shape across
// every resource)
export async function PUT(request: NextRequest, { params }: RouteContext) {
  const { id } = await params
  const body = await request.json()

  const parsed = subjectSchema.safeParse(body)
  if (!parsed.success) {
    return fail(400, 'Invalid request', parsed.error.flatten())
  }

  try {
    const subject = await prisma.subject.update({ where: { id }, data: parsed.data })
    return ok(subject)
  } catch (error) {
    return handlePrismaError(error)
  }
}

// PATCH /api/subjects/:id
export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const { id } = await params
  const body = await request.json()

  const parsed = subjectSchema.partial().safeParse(body)
  if (!parsed.success) {
    return fail(400, 'Invalid request', parsed.error.flatten())
  }

  try {
    const subject = await prisma.subject.update({ where: { id }, data: parsed.data })
    return ok(subject)
  } catch (error) {
    return handlePrismaError(error)
  }
}

// DELETE /api/subjects/:id — cascades to its TutorSubject links and
// PracticeQuestions (see `onDelete: Cascade` in prisma/schema.prisma)
export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  const { id } = await params

  try {
    await prisma.subject.delete({ where: { id } })
    return ok(null, 'Subject deleted')
  } catch (error) {
    return handlePrismaError(error)
  }
}
