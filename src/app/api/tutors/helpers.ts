import type { Prisma } from '@prisma/client'

/**
 * Shared between route.ts, [id]/route.ts and [id]/subjects/route.ts (same
 * "route.ts can only export handlers" reason schema.ts is split out — see
 * the comment at the top of that file).
 */

// What every /api/tutors response includes about each tutor:
//  - their subject list (through the TutorSubject join table, hence
//    `subjects.subject` rather than just `subjects`)
//  - their reviews
//  - a COUNT of their completed bookings, used below to compute `sessions`
//    (there's no `sessions` column on TutorProfile — it's derived, not
//    stored, so it can never drift out of sync with the real booking data)
export const tutorInclude = {
  subjects: { include: { subject: true } },
  reviews: true,
  _count: { select: { bookings: { where: { status: 'COMPLETED' } } } },
} as const

type TutorWithCount = Prisma.TutorProfileGetPayload<{ include: typeof tutorInclude }>

/** Turns the raw Prisma `_count.bookings` shape into a flat `sessions`
 * number, which is what the frontend (see src/hooks/useTutors.ts) actually
 * wants to render. Applied to every tutor response so the shape is
 * identical whether it came from GET, POST, PUT, or PATCH. */
export function withSessionsCount(tutor: TutorWithCount) {
  const { _count, ...rest } = tutor
  return { ...rest, sessions: _count.bookings }
}
