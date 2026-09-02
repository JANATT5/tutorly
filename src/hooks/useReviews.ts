import { createResourceHooks } from './createResourceHooks'
import type { Review, CreateReviewDto, ReviewEditDto } from '@/interfaces/review'

export type { Review, CreateReviewDto, ReviewEditDto }

export const {
  /** GET /api/reviews — e.g. useReviews({ tutorId }) */
  useList: useReviews,
  /** GET /api/reviews/:id */
  useOne: useReview,
  /** POST /api/reviews */
  useCreate: useCreateReview,
  /** PUT /api/reviews/:id */
  useUpdate: useUpdateReview,
  /** PATCH /api/reviews/:id */
  usePatch: usePatchReview,
  /** DELETE /api/reviews/:id */
  useDelete: useDeleteReview,
} = createResourceHooks<Review, CreateReviewDto, ReviewEditDto>({
  basePath: 'reviews',
  queryKey: 'reviews',
})
