import type { Prisma } from '@prisma/client'
import type { z } from 'zod'
import { createTutorSchema, tutorEditSchema } from '@/app/api/tutors/schema'

/**
 * Types for the tutors resource — kept separate from src/hooks/useTutors.ts
 * (which is just the react-query wiring) the same way src/interfaces/
 * already held IResponse before this pass. Entity shapes come from Prisma's
 * own generated types (so DB fields can never drift out of sync here); DTO
 * shapes come from zod's `z.infer`, so the request shape can never drift
 * from what the API route actually validates.
 */

// Keep this in sync with `tutorInclude`/`withSessionsCount` in
// src/app/api/tutors/helpers.ts. It starts from Prisma's own generated
// payload type and then applies the same "_count.bookings -> sessions"
// transform the API itself does before responding.
type TutorPayload = Prisma.TutorProfileGetPayload<{
  include: {
    subjects: { include: { subject: true } }
    reviews: true
    _count: { select: { bookings: true } }
  }
}>
export type Tutor = Omit<TutorPayload, '_count'> & { sessions: number }

export type CreateTutorDto = z.infer<typeof createTutorSchema>
export type TutorEditDto = z.infer<typeof tutorEditSchema>
