import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ok, created, fail, handlePrismaError } from '@/lib/apiResponse'
import { createStudentSchema } from '../schemas/students.schema'

// GET /api/students — list student profiles, optionally filtered by
// ?userId=<id> (used to look up "the current student's profile" from their
// User id — see src/hooks/useCurrentUser.ts)
export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId')

  const students = await prisma.studentProfile.findMany({
    where: userId ? { userId } : undefined,
    orderBy: { fullName: 'asc' },
  })

  return ok(students)
}

// POST /api/students — create a student profile (used once after a STUDENT
// user finishes onboarding)
export async function POST(request: NextRequest) {
  const body = await request.json()

  const parsed = createStudentSchema.safeParse(body)
  if (!parsed.success) {
    return fail(400, 'Invalid request', parsed.error.flatten())
  }

  try {
    const student = await prisma.studentProfile.create({ data: parsed.data })
    return created(student)
  } catch (error) {
    // Most likely cause here: userId isn't unique (this user already has a
    // student profile).
    return handlePrismaError(error)
  }
}
