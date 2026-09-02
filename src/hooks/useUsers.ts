import { createResourceHooks } from './createResourceHooks'
import type { SafeUser, CreateUserDto, UserEditDto } from '@/interfaces/user'

export type { SafeUser, CreateUserDto, UserEditDto }

export const {
  /** GET /api/users — e.g. useUsers({ role: 'TUTOR' }) or useUsers({ username }) */
  useList: useUsers,
  /** GET /api/users/:id */
  useOne: useUser,
  /** POST /api/users */
  useCreate: useCreateUser,
  /** PUT /api/users/:id */
  useUpdate: useUpdateUser,
  /** PATCH /api/users/:id */
  usePatch: usePatchUser,
  /** DELETE /api/users/:id */
  useDelete: useDeleteUser,
} = createResourceHooks<SafeUser, CreateUserDto, UserEditDto>({
  basePath: 'users',
  queryKey: 'users',
})
