import { createResourceHooks } from './createResourceHooks'
import type { Student, CreateStudentDto, StudentEditDto } from '@/interfaces/student'

export type { Student, CreateStudentDto, StudentEditDto }

export const {
  /** GET /api/students — e.g. useStudents({ userId }) */
  useList: useStudents,
  /** GET /api/students/:id */
  useOne: useStudent,
  /** POST /api/students */
  useCreate: useCreateStudent,
  /** PUT /api/students/:id */
  useUpdate: useUpdateStudent,
  /** PATCH /api/students/:id */
  usePatch: usePatchStudent,
  /** DELETE /api/students/:id */
  useDelete: useDeleteStudent,
} = createResourceHooks<Student, CreateStudentDto, StudentEditDto>({
  basePath: 'students',
  queryKey: 'students',
})
