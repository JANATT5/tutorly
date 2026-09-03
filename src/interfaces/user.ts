import type { z } from 'zod'
import { createUserSchema, userEditSchema } from '@/app/api/schemas/users.schema'

// Deliberately NOT `Prisma.UserGetPayload<...>` — every /api/users response
// is selected through `userSafeSelect` (see src/app/api/schemas/users.schema.ts),
// which leaves `password` out entirely. This type mirrors that select, so
// TypeScript itself would flag any attempt to read `.password` on the
// client.
export type SafeUser = {
  id: string
  username: string
  role: 'ADMIN' | 'TUTOR' | 'STUDENT'
  createdAt: string
}

export type CreateUserDto = z.infer<typeof createUserSchema>
export type UserEditDto = z.infer<typeof userEditSchema>
