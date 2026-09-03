import { z } from 'zod'

// `steps` is a Prisma `Json` column — the roadmap steps Planr generates.
// Typed loosely on purpose; see the matching note in
// quiz-results.schema.ts for why.
const stepsSchema = z.unknown()

// Body shape for POST /api/planr-paths — saving a generated learning path.
// studentId has a real foreign key to StudentProfile (unlike QuizResult's),
// so an invalid id here is caught by the database as a P2003 error.
export const createPlanrPathSchema = z.object({
  studentId: z.string().min(1, 'studentId is required'),
  goal: z.string().min(1, 'goal is required'),
  steps: stepsSchema,
})

// Editable after creation: goal/steps can be corrected; studentId never
// changes.
export const planrPathEditSchema = z.object({
  goal: z.string().min(1),
  steps: stepsSchema,
})
