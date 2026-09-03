import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ok, created, fail, handlePrismaError } from '@/lib/apiResponse'
import { createTutorSchema } from '../schemas/tutors.schema'
import { tutorInclude, withSessionsCount } from './helpers'

// GET /api/tutors — list tutors, optionally filtered by ?subject=<name>
// and/or ?userId=<id> (the latter used to look up "the current tutor's
// profile" from their User id — see src/hooks/useCurrentUser.ts)
// e.g. GET /api/tutors?subject=Math
export async function GET(request: NextRequest) {
  const subject = request.nextUrl.searchParams.get('subject')
  const userId = request.nextUrl.searchParams.get('userId')

  const tutors = await prisma.tutorProfile.findMany({
    where: {
      ...(subject ? { subjects: { some: { subject: { name: subject } } } } : {}),
      ...(userId ? { userId } : {}),
    },
    include: tutorInclude,
  })

  return ok(tutors.map(withSessionsCount))
}

// POST /api/tutors — create a tutor profile (used once after a TUTOR user
// finishes onboarding / their application is approved)
export async function POST(request: NextRequest) {
  const body = await request.json()

  // Validate before touching the database — see createTutorSchema in
  // ../schemas/tutors.schema.ts for exactly what's required.
  const parsed = createTutorSchema.safeParse(body)

  if (!parsed.success) {
    return fail(400, 'Invalid request', parsed.error.flatten())
  }

  try {
    const tutor = await prisma.tutorProfile.create({
      data: parsed.data,
      include: tutorInclude,
    })
    return created(withSessionsCount(tutor))
  } catch (error) {
    // Most likely cause here: userId isn't unique (this user already has a
    // tutor profile) — handlePrismaError turns that into a clean 409.
    return handlePrismaError(error)
  }
}
