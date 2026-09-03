import { NextRequest } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { ok, fail, created, handlePrismaError } from '@/lib/apiResponse'
import { createUserSchema, userSafeSelect } from '../schemas/users.schema'

// Validates the optional ?role= filter on GET /api/users
const roleQuerySchema = z.enum(['ADMIN', 'TUTOR', 'STUDENT']).optional()

// GET /api/users — list accounts, optionally filtered by ?role=ADMIN|TUTOR|STUDENT
// and/or ?username=<exact username>. The username filter is what
// src/hooks/useCurrentUser.ts uses to turn the fake session cookie's
// username (see src/lib/session.ts) into a real database id.
export async function GET(request: NextRequest) {
  const rawRole = request.nextUrl.searchParams.get('role')
  const username = request.nextUrl.searchParams.get('username')

  const parsedRole = roleQuerySchema.safeParse(rawRole ?? undefined)
  if (!parsedRole.success) {
    return fail(400, 'Invalid role filter', parsedRole.error.flatten())
  }

  const users = await prisma.user.findMany({
    where: {
      ...(parsedRole.data ? { role: parsedRole.data } : {}),
      ...(username ? { username } : {}),
    },
    select: userSafeSelect,
    orderBy: { createdAt: 'desc' },
  })

  return ok(users)
}

// POST /api/users — create an account
export async function POST(request: NextRequest) {
  const body = await request.json()

  const parsed = createUserSchema.safeParse(body)
  if (!parsed.success) {
    return fail(400, 'Invalid request', parsed.error.flatten())
  }

  try {
    const user = await prisma.user.create({
      data: parsed.data,
      select: userSafeSelect,
    })
    return created(user)
  } catch (error) {
    // Most likely cause here: username isn't unique.
    return handlePrismaError(error)
  }
}
