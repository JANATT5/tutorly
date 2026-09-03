import type { QuizQuestion } from '@prisma/client'
import type { z } from 'zod'
import { quizQuestionSchema } from '@/app/api/schemas/quiz-questions.schema'

export type { QuizQuestion }
export type QuizQuestionDto = z.infer<typeof quizQuestionSchema>
