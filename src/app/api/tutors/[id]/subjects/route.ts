import { NextRequest } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { ok, fail, handlePrismaError } from '@/lib/apiResponse'
import { tutorInclude, withSessionsCount } from '../../helpers'

type RouteContext = { params: Promise<{ id: string }> }

const replaceSubjectsSchema = z.object({
  subjectIds: z.array(z.string().min(1)),
})

/**
 * PATCH /api/tutors/:id/subjects — replace a tutor's full subject list in
 * one call (what the tutor's "edit subjects" form will send).
 *
 * This is its own nested route instead of a field on
 * PATCH /api/tutors/:id because a tutor's subjects live in TutorSubject, a
 * many-to-many JOIN table (see prisma/schema.prisma) — there's no single
 * "subjects" column on TutorProfile to just set a new value for.
 *
 * Body: { "subjectIds": ["subj_1", "subj_2"] }
 */
export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const { id } = await params
  const body = await request.json()

  const parsed = replaceSubjectsSchema.safeParse(body)
  if (!parsed.success) {
    return fail(400, 'Invalid request', parsed.error.flatten())
  }

  // Check the tutor exists *before* touching the join table, so a bad id
  // reads as a clean 404 instead of a confusing foreign-key error.
  const tutorExists = await prisma.tutorProfile.findUnique({
    where: { id },
    select: { id: true },
  })
  if (!tutorExists) return fail(404, 'Tutor not found')

  try {
    // One transaction: wipe this tutor's current subject links, then
    // recreate exactly the list that was sent. Simpler and safer than
    // diffing old vs new list by hand — either both steps happen, or
    // neither does.
    await prisma.$transaction([
      prisma.tutorSubject.deleteMany({ where: { tutorId: id } }),
      ...(parsed.data.subjectIds.length > 0
        ? [
            prisma.tutorSubject.createMany({
              data: parsed.data.subjectIds.map((subjectId) => ({ tutorId: id, subjectId })),
            }),
          ]
        : []),
    ])

    const tutor = await prisma.tutorProfile.findUnique({
      where: { id },
      include: tutorInclude,
    })

    return ok(tutor ? withSessionsCount(tutor) : null)
  } catch (error) {
    // Most likely cause here: one of the subjectIds doesn't exist.
    return handlePrismaError(error)
  }
}
