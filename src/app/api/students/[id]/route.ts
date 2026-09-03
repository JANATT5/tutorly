import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ok, fail, handlePrismaError } from '@/lib/apiResponse'
import { studentEditSchema } from '../../schemas/students.schema'

type RouteContext = { params: Promise<{ id: string }> }

// GET /api/students/:id
export async function GET(_request: NextRequest, { params }: RouteContext) {
  const { id } = await params

  const student = await prisma.studentProfile.findUnique({ where: { id } })

  if (!student) return fail(404, 'Student not found')
  return ok(student)
}

// PUT /api/students/:id — full replace of the editable fields
export async function PUT(request: NextRequest, { params }: RouteContext) {
  const { id } = await params
  const body = await request.json()

  const parsed = studentEditSchema.safeParse(body)
  if (!parsed.success) {
    return fail(400, 'Invalid request', parsed.error.flatten())
  }

  try {
    const student = await prisma.studentProfile.update({
      where: { id },
      data: parsed.data,
    })
    return ok(student)
  } catch (error) {
    return handlePrismaError(error)
  }
}

// PATCH /api/students/:id — partial update
export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const { id } = await params
  const body = await request.json()

  const parsed = studentEditSchema.partial().safeParse(body)
  if (!parsed.success) {
    return fail(400, 'Invalid request', parsed.error.flatten())
  }

  try {
    const student = await prisma.studentProfile.update({
      where: { id },
      data: parsed.data,
    })
    return ok(student)
  } catch (error) {
    return handlePrismaError(error)
  }
}

// DELETE /api/students/:id
export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  const { id } = await params

  try {
    await prisma.studentProfile.delete({ where: { id } })
    return ok(null, 'Student deleted')
  } catch (error) {
    return handlePrismaError(error)
  }
}
