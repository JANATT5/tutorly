import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ok, fail, handlePrismaError } from '@/lib/apiResponse'
import { practiceQuestionEditSchema } from '../schema'

type RouteContext = { params: Promise<{ id: string }> }

// GET /api/practice-questions/:id
export async function GET(_request: NextRequest, { params }: RouteContext) {
  const { id } = await params

  const question = await prisma.practiceQuestion.findUnique({ where: { id } })

  if (!question) return fail(404, 'Practice question not found')
  return ok(question)
}

// PUT /api/practice-questions/:id — full replace
export async function PUT(request: NextRequest, { params }: RouteContext) {
  const { id } = await params
  const body = await request.json()

  const parsed = practiceQuestionEditSchema.safeParse(body)
  if (!parsed.success) {
    return fail(400, 'Invalid request', parsed.error.flatten())
  }

  try {
    const question = await prisma.practiceQuestion.update({ where: { id }, data: parsed.data })
    return ok(question)
  } catch (error) {
    return handlePrismaError(error)
  }
}

// PATCH /api/practice-questions/:id — partial update
export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const { id } = await params
  const body = await request.json()

  const parsed = practiceQuestionEditSchema.partial().safeParse(body)
  if (!parsed.success) {
    return fail(400, 'Invalid request', parsed.error.flatten())
  }

  try {
    const question = await prisma.practiceQuestion.update({ where: { id }, data: parsed.data })
    return ok(question)
  } catch (error) {
    return handlePrismaError(error)
  }
}

// DELETE /api/practice-questions/:id
export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  const { id } = await params

  try {
    await prisma.practiceQuestion.delete({ where: { id } })
    return ok(null, 'Practice question deleted')
  } catch (error) {
    return handlePrismaError(error)
  }
}
