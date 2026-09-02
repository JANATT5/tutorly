import type { QuizQuestion } from '@prisma/client'
import type { z } from 'zod'
import { quizQuestionSchema } from '@/app/api/quiz-questions/schema'

export type { QuizQuestion }
export type QuizQuestionDto = z.infer<typeof quizQuestionSchema>
