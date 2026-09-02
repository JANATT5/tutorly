import type { Review } from '@prisma/client'
import type { z } from 'zod'
import { createReviewSchema, reviewEditSchema } from '@/app/api/reviews/schema'

export type { Review }
export type CreateReviewDto = z.infer<typeof createReviewSchema>
export type ReviewEditDto = z.infer<typeof reviewEditSchema>
