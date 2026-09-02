import { createResourceHooks } from './createResourceHooks'
import type { PlanrPath, CreatePlanrPathDto, PlanrPathEditDto } from '@/interfaces/planrPath'

export type { PlanrPath, CreatePlanrPathDto, PlanrPathEditDto }

export const {
  /** GET /api/planr-paths — e.g. usePlanrPaths({ studentId }) */
  useList: usePlanrPaths,
  /** GET /api/planr-paths/:id */
  useOne: usePlanrPath,
  /** POST /api/planr-paths */
  useCreate: useCreatePlanrPath,
  /** PUT /api/planr-paths/:id */
  useUpdate: useUpdatePlanrPath,
  /** PATCH /api/planr-paths/:id */
  usePatch: usePatchPlanrPath,
  /** DELETE /api/planr-paths/:id */
  useDelete: useDeletePlanrPath,
} = createResourceHooks<PlanrPath, CreatePlanrPathDto, PlanrPathEditDto>({
  basePath: 'planr-paths',
  queryKey: 'planr-paths',
})
