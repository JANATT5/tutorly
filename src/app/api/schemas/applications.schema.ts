import { z } from 'zod'

/**
 * Zod schemas for the /api/applications resource. Split out of route.ts
 * (where the original version lived) for the same reason as
 * tutors.schema.ts: both route.ts and [id]/route.ts need these,
 * and route.ts files should only export HTTP method handlers. All zod
 * schemas for the API live together in src/app/api/schemas/ so each
 * resource's route files stay focused on handlers only.
 */

// The 4 states a tutor application can be in (see prisma/schema.prisma).
const applicationStatusEnum = z.enum([
  'PENDING',
  'UNDER_REVIEW',
  'APPROVED',
  'REJECTED',
])

// Validates the optional ?status= filter on GET /api/applications
export const statusQuerySchema = applicationStatusEnum.optional()

// Body shape for POST /api/applications — a tutor submitting their
// become-a-tutor application.
export const createApplicationSchema = z.object({
  tutorId: z.string().min(1, 'tutorId is required'),
  documents: z.array(z.string()).optional().default([]),
  aiScore: z.number().min(0).max(100).optional().nullable(),
})

// The fields an admin can edit once an application exists: re-check its
// documents/aiScore, and move it through the review states.
export const applicationEditSchema = z.object({
  status: applicationStatusEnum,
  documents: z.array(z.string()),
  aiScore: z.number().min(0).max(100).nullable(),
})

// PENDING/UNDER_REVIEW are "still open"; APPROVED/REJECTED are "decided".
// Used by [id]/route.ts to know when to auto-stamp `reviewedAt`.
export function isDecided(status: z.infer<typeof applicationStatusEnum>) {
  return status === 'APPROVED' || status === 'REJECTED'
}
