import { createResourceHooks } from './createResourceHooks'
import type { Subject, SubjectDto } from '@/interfaces/subject'

export type { Subject, SubjectDto }

export const {
  /** GET /api/subjects */
  useList: useSubjects,
  /** GET /api/subjects/:id */
  useOne: useSubject,
  /** POST /api/subjects */
  useCreate: useCreateSubject,
  /** PUT /api/subjects/:id */
  useUpdate: useUpdateSubject,
  /** PATCH /api/subjects/:id */
  usePatch: usePatchSubject,
  /** DELETE /api/subjects/:id */
  useDelete: useDeleteSubject,
} = createResourceHooks<Subject, SubjectDto, SubjectDto>({
  basePath: 'subjects',
  queryKey: 'subjects',
})
