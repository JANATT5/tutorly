import { z } from 'zod'

/**
 * Zod schemas for the /api/users resource.
 *
 * SECURITY NOTE: `password` is a real column on User, but this API never
 * returns it in a response — every route below reads through
 * `userSafeSelect`, which simply leaves `password` out of the SELECT
 * entirely (not "filtered after the fact", which is easy to forget in one
 * spot and leak). The one thing this pass deliberately does NOT add is
 * password *hashing* (e.g. bcrypt) — that's a bigger, separate security
 * task, and the current login flow (src/lib/session.ts) is still a fake
 * demo login unrelated to this table, per the earlier "leave login fake"
 * decision. Flagging it clearly here so it isn't forgotten.
 */

const roleEnum = z.enum(['ADMIN', 'TUTOR', 'STUDENT'])

// Body shape for POST /api/users — creating a new account.
export const createUserSchema = z.object({
  username: z.string().min(1, 'username is required'),
  password: z.string().min(4, 'password must be at least 4 characters'),
  role: roleEnum,
})

// Editable after creation. `password` is optional even on PUT (a "full
// profile save" shouldn't force re-entering a password every time) — when
// it's left out, Prisma's update() treats an `undefined` field as "don't
// change this", so the stored password is simply untouched.
export const userEditSchema = z.object({
  username: z.string().min(1),
  role: roleEnum,
  password: z.string().min(4).optional(),
})

// Reused on every query so `password` can never accidentally end up in a
// response.
export const userSafeSelect = {
  id: true,
  username: true,
  role: true,
  createdAt: true,
} as const
