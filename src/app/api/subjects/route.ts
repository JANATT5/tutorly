import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ok, created, fail, handlePrismaError } from '@/lib/apiResponse'
import { subjectSchema } from './schema'

// GET /api/subjects — list every subject (Math, Physics, ...)
export async function GET() {
  const subjects = await prisma.subject.findMany({ orderBy: { name: 'asc' } })
  return ok(subjects)
}

// POST /api/subjects — add a new subject (admin-only in practice, but this
// route itself doesn't enforce that yet — see docs/API_GUIDE.md for notes
// on what's still missing, like auth/authorization checks)
export async function POST(request: NextRequest) {
  const body = await request.json()

  const parsed = subjectSchema.safeParse(body)
  if (!parsed.success) {
    return fail(400, 'Invalid request', parsed.error.flatten())
  }

  try {
    const subject = await prisma.subject.create({ data: parsed.data })
    return created(subject)
  } catch (error) {
    // Most likely cause here: name isn't unique.
    return handlePrismaError(error)
  }
}
