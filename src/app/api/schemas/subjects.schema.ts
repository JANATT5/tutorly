import { z } from 'zod'

// Subject only has one real field, so the same schema covers create (POST),
// full-replace (PUT), and — via `.partial()` in [id]/route.ts — PATCH too.
export const subjectSchema = z.object({
  name: z.string().min(1, 'name is required'),
})
