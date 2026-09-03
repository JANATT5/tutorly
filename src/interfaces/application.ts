import type { Prisma } from '@prisma/client'
import type { z } from 'zod'
import { createApplicationSchema, applicationEditSchema } from '@/app/api/schemas/applications.schema'

// Matches `include: { tutor: true }` in src/app/api/applications/route.ts.
export type TutorApplication = Prisma.TutorApplicationGetPayload<{
  include: { tutor: true }
}>

export type CreateApplicationDto = z.infer<typeof createApplicationSchema>
export type ApplicationEditDto = z.infer<typeof applicationEditSchema>
