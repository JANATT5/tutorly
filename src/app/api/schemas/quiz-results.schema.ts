import { z } from 'zod'

/**
 * NOTE ON studentId: unlike every other "identity" field in this API (e.g.
 * TutorProfile.userId), QuizResult.studentId is a plain string column in
 * prisma/schema.prisma with NO foreign key relation to StudentProfile. That
 * means this route can check it's a non-empty string, but — unlike
 * tutorId/subjectId elsewhere — a typo'd id will NOT be caught by the
 * database (no P2003 foreign key error is possible here). This is a schema
 * gap worth fixing later (see docs/API_GUIDE.md), not something this route
 * can work around on its own.
 */

// `answers` is a Prisma `Json` column — whatever shape the quiz UI wants to
// save (e.g. { [questionId]: chosenOption }). Deliberately typed loosely
// here since the exact shape is owned by the frontend quiz code, not the API.
const answersSchema = z.unknown()

// Body shape for POST /api/quiz-results — saving one completed quiz attempt.
export const createQuizResultSchema = z.object({
  studentId: z.string().min(1, 'studentId is required'),
  resultLabel: z.string().min(1, 'resultLabel is required'),
  answers: answersSchema,
})

// Editable after creation: resultLabel/answers can be corrected; studentId
// (whose result this is) never changes.
export const quizResultEditSchema = z.object({
  resultLabel: z.string().min(1),
  answers: answersSchema,
})
