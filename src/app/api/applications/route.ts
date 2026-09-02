import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ok, created, fail, handlePrismaError } from '@/lib/apiResponse'
import { statusQuerySchema, createApplicationSchema } from './schema'

// GET /api/applications — admin dashboard: list applications, optionally by
// status, e.g. GET /api/applications?status=PENDING
export async function GET(request: NextRequest) {
  const rawStatus = request.nextUrl.searchParams.get('status')

  const parsedStatus = statusQuerySchema.safeParse(rawStatus ?? undefined)

  if (!parsedStatus.success) {
    return fail(400, 'Invalid status filter', parsedStatus.error.flatten())
  }

  const applications = await prisma.tutorApplication.findMany({
    where: parsedStatus.data ? { status: parsedStatus.data } : undefined,
    include: { tutor: true },
    orderBy: { submittedAt: 'desc' },
  })

  return ok(applications)
}

// POST /api/applications — submit a become-a-tutor application
export async function POST(request: NextRequest) {
  const body = await request.json()

  // Validate before touching the database
  const parsed = createApplicationSchema.safeParse(body)

  if (!parsed.success) {
    return fail(400, 'Invalid request', parsed.error.flatten())
  }

  try {
    const application = await prisma.tutorApplication.create({
      data: {
        tutorId: parsed.data.tutorId,
        documents: parsed.data.documents,
        aiScore: parsed.data.aiScore ?? null,
      },
    })
    return created(application)
  } catch (error) {
    // Most likely cause here: this tutor already has an application
    // (tutorId is @unique on TutorApplication) — becomes a clean 409.
    return handlePrismaError(error)
  }
}
