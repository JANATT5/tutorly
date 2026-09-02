import { z } from 'zod'

// Body shape for POST /api/practice-questions — adding one MCQ to the bank.
export const createPracticeQuestionSchema = z.object({
  subjectId: z.string().min(1, 'subjectId is required'),
  question: z.string().min(1, 'question is required'),
  options: z.array(z.string().min(1)).min(2, 'need at least 2 options'),
  correctAnswer: z.string().min(1, 'correctAnswer is required'),
  // Free-text on purpose (e.g. "Easy"/"Medium"/"Hard") — the schema doesn't
  // constrain it to a fixed enum since Prisma stores it as a plain String.
  difficulty: z.string().min(1, 'difficulty is required'),
})

// Editable after creation: subjectId (which subject this question belongs
// to) is set once at creation, like every other identity foreign key in
// this API.
export const practiceQuestionEditSchema = z.object({
  question: z.string().min(1),
  options: z.array(z.string().min(1)).min(2),
  correctAnswer: z.string().min(1),
  difficulty: z.string().min(1),
})
