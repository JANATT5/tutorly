import { NextRequest } from 'next/server'
import type { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { ok, created, fail, handlePrismaError } from '@/lib/apiResponse'
import { createPlanrPathSchema } from './schema'

// GET /api/planr-paths — list learning paths, optionally filtered by
// ?studentId=<id> (a student's own Planr roadmap(s))
export async function GET(request: NextRequest) {
  const studentId = request.nextUrl.searchParams.get('studentId')

  const paths = await prisma.planrPath.findMany({
    where: studentId ? { studentId } : undefined,
    orderBy: { createdAt: 'desc' },
  })

  return ok(paths)
}

// POST /api/planr-paths — save a generated learning path for a student
export async function POST(request: NextRequest) {
  const body = await request.json()

  const parsed = createPlanrPathSchema.safeParse(body)
  if (!parsed.success) {
    return fail(400, 'Invalid request', parsed.error.flatten())
  }

  try {
    const path = await prisma.planrPath.create({
      // The "Unchecked" input variant is what Prisma generates for writing
      // a relation's foreign key directly (studentId) instead of the
      // nested `student: { connect: { id: ... } }` form — which is exactly
      // what we're doing here.
      data: parsed.data as Prisma.PlanrPathUncheckedCreateInput,
    })
    return created(path)
  } catch (error) {
    // Most likely cause here: studentId doesn't point to a real student.
    return handlePrismaError(error)
  }
}
