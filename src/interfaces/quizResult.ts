import type { QuizResult } from '@prisma/client'
import type { z } from 'zod'
import { createQuizResultSchema, quizResultEditSchema } from '@/app/api/quiz-results/schema'

export type { QuizResult }
export type CreateQuizResultDto = z.infer<typeof createQuizResultSchema>
export type QuizResultEditDto = z.infer<typeof quizResultEditSchema>
