import { createResourceHooks } from './createResourceHooks'
import type { QuizResult, CreateQuizResultDto, QuizResultEditDto } from '@/interfaces/quizResult'

export type { QuizResult, CreateQuizResultDto, QuizResultEditDto }

export const {
  /** GET /api/quiz-results — e.g. useQuizResults({ studentId }) */
  useList: useQuizResults,
  /** GET /api/quiz-results/:id */
  useOne: useQuizResult,
  /** POST /api/quiz-results */
  useCreate: useCreateQuizResult,
  /** PUT /api/quiz-results/:id */
  useUpdate: useUpdateQuizResult,
  /** PATCH /api/quiz-results/:id */
  usePatch: usePatchQuizResult,
  /** DELETE /api/quiz-results/:id */
  useDelete: useDeleteQuizResult,
} = createResourceHooks<QuizResult, CreateQuizResultDto, QuizResultEditDto>({
  basePath: 'quiz-results',
  queryKey: 'quiz-results',
})
