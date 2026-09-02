import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ok, fail, handlePrismaError } from '@/lib/apiResponse'
import { quizQuestionSchema } from '../schema'

type RouteContext = { params: Promise<{ id: string }> }

// GET /api/quiz-questions/:id
export async function GET(_request: NextRequest, { params }: RouteContext) {
  const { id } = await params

  const question = await prisma.quizQuestion.findUnique({ where: { id } })

  if (!question) return fail(404, 'Quiz question not found')
  return ok(question)
}

// PUT /api/quiz-questions/:id — full replace
export async function PUT(request: NextRequest, { params }: RouteContext) {
  const { id } = await params
  const body = await request.json()

  const parsed = quizQuestionSchema.safeParse(body)
  if (!parsed.success) {
    return fail(400, 'Invalid request', parsed.error.flatten())
  }

  try {
    const question = await prisma.quizQuestion.update({ where: { id }, data: parsed.data })
    return ok(question)
  } catch (error) {
    return handlePrismaError(error)
  }
}

// PATCH /api/quiz-questions/:id — partial update
export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const { id } = await params
  const body = await request.json()

  const parsed = quizQuestionSchema.partial().safeParse(body)
  if (!parsed.success) {
    return fail(400, 'Invalid request', parsed.error.flatten())
  }

  try {
    const question = await prisma.quizQuestion.update({ where: { id }, data: parsed.data })
    return ok(question)
  } catch (error) {
    return handlePrismaError(error)
  }
}

// DELETE /api/quiz-questions/:id
export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  const { id } = await params

  try {
    await prisma.quizQuestion.delete({ where: { id } })
    return ok(null, 'Quiz question deleted')
  } catch (error) {
    return handlePrismaError(error)
  }
}
