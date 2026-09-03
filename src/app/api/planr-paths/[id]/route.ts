import { NextRequest } from 'next/server'
import type { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { ok, fail, handlePrismaError } from '@/lib/apiResponse'
import { planrPathEditSchema } from '../../schemas/planr-paths.schema'

type RouteContext = { params: Promise<{ id: string }> }

// GET /api/planr-paths/:id
export async function GET(_request: NextRequest, { params }: RouteContext) {
  const { id } = await params

  const path = await prisma.planrPath.findUnique({ where: { id } })

  if (!path) return fail(404, 'Planr path not found')
  return ok(path)
}

// PUT /api/planr-paths/:id — full replace
export async function PUT(request: NextRequest, { params }: RouteContext) {
  const { id } = await params
  const body = await request.json()

  const parsed = planrPathEditSchema.safeParse(body)
  if (!parsed.success) {
    return fail(400, 'Invalid request', parsed.error.flatten())
  }

  try {
    const path = await prisma.planrPath.update({
      where: { id },
      data: parsed.data as Prisma.PlanrPathUpdateInput,
    })
    return ok(path)
  } catch (error) {
    return handlePrismaError(error)
  }
}

// PATCH /api/planr-paths/:id — partial update
export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const { id } = await params
  const body = await request.json()

  const parsed = planrPathEditSchema.partial().safeParse(body)
  if (!parsed.success) {
    return fail(400, 'Invalid request', parsed.error.flatten())
  }

  try {
    const path = await prisma.planrPath.update({
      where: { id },
      data: parsed.data as Prisma.PlanrPathUpdateInput,
    })
    return ok(path)
  } catch (error) {
    return handlePrismaError(error)
  }
}

// DELETE /api/planr-paths/:id
export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  const { id } = await params

  try {
    await prisma.planrPath.delete({ where: { id } })
    return ok(null, 'Planr path deleted')
  } catch (error) {
    return handlePrismaError(error)
  }
}
