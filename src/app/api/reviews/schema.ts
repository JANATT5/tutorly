import { z } from 'zod'

// Body shape for POST /api/reviews — a student rating a tutor after a session.
export const createReviewSchema = z.object({
  tutorId: z.string().min(1, 'tutorId is required'),
  rating: z.number().int().min(1, 'rating must be 1-5').max(5, 'rating must be 1-5'),
  comment: z.string().min(1).optional().nullable(),
})

// Editable after creation: rating/comment can be corrected, but tutorId
// (who the review is about) never changes.
export const reviewEditSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(1).nullable(),
})
