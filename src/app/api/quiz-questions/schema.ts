import { z } from 'zod'

// QuizQuestion has no foreign keys at all, so there's no "identity field" to
// exclude from editing — one schema covers POST, PUT (as-is) and PATCH (via
// `.partial()` in the route files).
export const quizQuestionSchema = z.object({
  prompt: z.string().min(1, 'prompt is required'),
  options: z.array(z.string().min(1)).min(2, 'need at least 2 options'),
})
