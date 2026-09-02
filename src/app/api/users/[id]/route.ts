import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ok, fail, handlePrismaError } from '@/lib/apiResponse'
import { userEditSchema, userSafeSelect } from '../schema'

type RouteContext = { params: Promise<{ id: string }> }

// GET /api/users/:id
export async function GET(_request: NextRequest, { params }: RouteContext) {
  const { id } = await params

  const user = await prisma.user.findUnique({
    where: { id },
    select: userSafeSelect,
  })

  if (!user) return fail(404, 'User not found')
  return ok(user)
}

// PUT /api/users/:id — full replace of username/role (password optional,
// see the note in ../schema.ts on why)
export async function PUT(request: NextRequest, { params }: RouteContext) {
  const { id } = await params
  const body = await request.json()

  const parsed = userEditSchema.safeParse(body)
  if (!parsed.success) {
    return fail(400, 'Invalid request', parsed.error.flatten())
  }

  try {
    const user = await prisma.user.update({
      where: { id },
      data: parsed.data,
      select: userSafeSelect,
    })
    return ok(user)
  } catch (error) {
    return handlePrismaError(error)
  }
}

// PATCH /api/users/:id — partial update, e.g. { "role": "TUTOR" }
export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const { id } = await params
  const body = await request.json()

  const parsed = userEditSchema.partial().safeParse(body)
  if (!parsed.success) {
    return fail(400, 'Invalid request', parsed.error.flatten())
  }

  try {
    const user = await prisma.user.update({
      where: { id },
      data: parsed.data,
      select: userSafeSelect,
    })
    return ok(user)
  } catch (error) {
    return handlePrismaError(error)
  }
}

// DELETE /api/users/:id — cascades to that user's studentProfile/tutorProfile
// (see the `onDelete: Cascade` relations in prisma/schema.prisma)
export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  const { id } = await params

  try {
    await prisma.user.delete({ where: { id } })
    return ok(null, 'User deleted')
  } catch (error) {
    return handlePrismaError(error)
  }
}
