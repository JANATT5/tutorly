import { createResourceHooks } from './createResourceHooks'
import type {
  TutorApplication,
  CreateApplicationDto,
  ApplicationEditDto,
} from '@/interfaces/application'

export type { TutorApplication, CreateApplicationDto, ApplicationEditDto }

export const {
  /** GET /api/applications — e.g. useApplications({ status: 'PENDING' }) */
  useList: useApplications,
  /** GET /api/applications/:id */
  useOne: useApplication,
  /** POST /api/applications */
  useCreate: useCreateApplication,
  /** PUT /api/applications/:id */
  useUpdate: useUpdateApplication,
  /** PATCH /api/applications/:id — e.g. the admin approve/reject buttons
   * send just { status: 'APPROVED' } */
  usePatch: usePatchApplication,
  /** DELETE /api/applications/:id */
  useDelete: useDeleteApplication,
} = createResourceHooks<TutorApplication, CreateApplicationDto, ApplicationEditDto>({
  basePath: 'applications',
  queryKey: 'applications',
})
