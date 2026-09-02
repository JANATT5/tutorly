import { createResourceHooks } from './createResourceHooks'
import type {
  PracticeQuestion,
  CreatePracticeQuestionDto,
  PracticeQuestionEditDto,
} from '@/interfaces/practiceQuestion'

export type { PracticeQuestion, CreatePracticeQuestionDto, PracticeQuestionEditDto }

export const {
  /** GET /api/practice-questions — e.g. useX({ subjectId, difficulty }) */
  useList: usePracticeQuestions,
  /** GET /api/practice-questions/:id */
  useOne: usePracticeQuestion,
  /** POST /api/practice-questions */
  useCreate: useCreatePracticeQuestion,
  /** PUT /api/practice-questions/:id */
  useUpdate: useUpdatePracticeQuestion,
  /** PATCH /api/practice-questions/:id */
  usePatch: usePatchPracticeQuestion,
  /** DELETE /api/practice-questions/:id */
  useDelete: useDeletePracticeQuestion,
} = createResourceHooks<PracticeQuestion, CreatePracticeQuestionDto, PracticeQuestionEditDto>({
  basePath: 'practice-questions',
  queryKey: 'practice-questions',
})
