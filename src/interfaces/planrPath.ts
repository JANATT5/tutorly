import type { PlanrPath } from '@prisma/client'
import type { z } from 'zod'
import { createPlanrPathSchema, planrPathEditSchema } from '@/app/api/planr-paths/schema'

export type { PlanrPath }
export type CreatePlanrPathDto = z.infer<typeof createPlanrPathSchema>
export type PlanrPathEditDto = z.infer<typeof planrPathEditSchema>
