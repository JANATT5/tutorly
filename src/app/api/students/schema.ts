import { z } from 'zod'

const curriculumEnum = z.enum(['LEBANESE', 'FRENCH', 'AMERICAN'])

// Body shape for POST /api/students — creating a student profile.
// `userId` links this to an existing User (role STUDENT); like every other
// "identity" foreign key in this API, it's set once at creation and is
// deliberately left out of studentEditSchema below.
export const createStudentSchema = z.object({
  userId: z.string().min(1, 'userId is required'),
  fullName: z.string().min(1, 'fullName is required'),
  curriculum: curriculumEnum,
  grade: z.string().min(1, 'grade is required'),
})

// Fields a student (or admin) can edit after the profile exists.
export const studentEditSchema = z.object({
  fullName: z.string().min(1),
  curriculum: curriculumEnum,
  grade: z.string().min(1),
})
