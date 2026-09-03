import type { PracticeQuestion } from '@prisma/client'
import type { z } from 'zod'
import {
  createPracticeQuestionSchema,
  practiceQuestionEditSchema,
} from '@/app/api/schemas/practice-questions.schema'

export type { PracticeQuestion }
export type CreatePracticeQuestionDto = z.infer<typeof createPracticeQuestionSchema>
export type PracticeQuestionEditDto = z.infer<typeof practiceQuestionEditSchema>
