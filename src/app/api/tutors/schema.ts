import { z } from 'zod'

/**
 * Zod schemas for the /api/tutors resource. Kept in their own file (instead
 * of inline in route.ts, the way applications/route.ts originally did it)
 * because BOTH route.ts (list/create) and [id]/route.ts (read/update/delete
 * one) need `tutorEditSchema`, and route.ts files in Next.js are only
 * supposed to export HTTP method handlers (GET, POST, ...) — not arbitrary
 * extra things like a schema.
 */

// The 3 curriculum tracks used across the app (see prisma/schema.prisma).
const curriculumEnum = z.enum(['LEBANESE', 'FRENCH', 'AMERICAN'])

// Body shape for POST /api/tutors — creating a brand new tutor profile.
// `userId` links this profile to an existing User row (whose role should be
// TUTOR). It's set once at creation time and never changes afterwards, so
// it's deliberately NOT part of tutorEditSchema below — nobody should be
// able to "move" a tutor profile onto a different user via PUT/PATCH.
export const createTutorSchema = z.object({
  userId: z.string().min(1, 'userId is required'),
  fullName: z.string().min(1, 'fullName is required'),
  bio: z.string().min(1, 'bio is required'),
  curriculum: curriculumEnum,
  hourlyRate: z.number().positive('hourlyRate must be greater than 0'),
  avatar: z.string().url().optional().nullable(),
  languages: z.array(z.string().min(1)).optional().default([]),
  location: z.string().min(1).optional().nullable(),
  experienceYears: z.number().int().min(0).optional().nullable(),
})

// The fields a tutor/admin is allowed to edit after the profile exists.
// Used as-is for PUT (full replace, every field required) and as
// `.partial()` for PATCH (partial update, every field optional) in
// [id]/route.ts.
export const tutorEditSchema = z.object({
  fullName: z.string().min(1),
  bio: z.string().min(1),
  curriculum: curriculumEnum,
  hourlyRate: z.number().positive(),
  // Admin-controlled "approved to teach" flag.
  verified: z.boolean(),
  // Average review rating, 0-5. Nullable because a brand new tutor has no
  // reviews yet.
  rating: z.number().min(0).max(5).nullable(),
  avatar: z.string().url().nullable(),
  languages: z.array(z.string().min(1)),
  location: z.string().min(1).nullable(),
  experienceYears: z.number().int().min(0).nullable(),
})
