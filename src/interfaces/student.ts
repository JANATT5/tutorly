import type { StudentProfile } from '@prisma/client'
import type { z } from 'zod'
import { createStudentSchema, studentEditSchema } from '@/app/api/students/schema'

export type Student = StudentProfile
export type CreateStudentDto = z.infer<typeof createStudentSchema>
export type StudentEditDto = z.infer<typeof studentEditSchema>
