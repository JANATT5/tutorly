import { createResourceHooks } from './createResourceHooks'
import type { QuizQuestion, QuizQuestionDto } from '@/interfaces/quizQuestion'

export type { QuizQuestion, QuizQuestionDto }

export const {
  /** GET /api/quiz-questions */
  useList: useQuizQuestions,
  /** GET /api/quiz-questions/:id */
  useOne: useQuizQuestion,
  /** POST /api/quiz-questions */
  useCreate: useCreateQuizQuestion,
  /** PUT /api/quiz-questions/:id */
  useUpdate: useUpdateQuizQuestion,
  /** PATCH /api/quiz-questions/:id */
  usePatch: usePatchQuizQuestion,
  /** DELETE /api/quiz-questions/:id */
  useDelete: useDeleteQuizQuestion,
} = createResourceHooks<QuizQuestion, QuizQuestionDto, QuizQuestionDto>({
  basePath: 'quiz-questions',
  queryKey: 'quiz-questions',
})
