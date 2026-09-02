import type { Subject } from '@prisma/client'
import type { z } from 'zod'
import { subjectSchema } from '@/app/api/subjects/schema'

export type { Subject }
export type SubjectDto = z.infer<typeof subjectSchema>
