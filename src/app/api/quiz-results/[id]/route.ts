import { NextRequest } from 'next/server'
import type { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { ok, fail, handlePrismaError } from '@/lib/apiResponse'
import { quizResultEditSchema } from '../schema'

type RouteContext = { params: Promise<{ id: string }> }

// GET /api/quiz-results/:id
export async function GET(_request: NextRequest, { params }: RouteContext) {
  const { id } = await params

  const result = await prisma.quizResult.findUnique({ where: { id } })

  if (!result) return fail(404, 'Quiz result not found')
  return ok(result)
}

// PUT /api/quiz-results/:id — full replace
export async function PUT(request: NextRequest, { params }: RouteContext) {
  const { id } = await params
  const body = await request.json()

  const parsed = quizResultEditSchema.safeParse(body)
  if (!parsed.success) {
    return fail(400, 'Invalid request', parsed.error.flatten())
  }

  try {
    const result = await prisma.quizResult.update({
      where: { id },
      data: parsed.data as Prisma.QuizResultUpdateInput,
    })
    return ok(result)
  } catch (error) {
    return handlePrismaError(error)
  }
}

// PATCH /api/quiz-results/:id — partial update
export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const { id } = await params
  const body = await request.json()

  const parsed = quizResultEditSchema.partial().safeParse(body)
  if (!parsed.success) {
    return fail(400, 'Invalid request', parsed.error.flatten())
  }

  try {
    const result = await prisma.quizResult.update({
      where: { id },
      data: parsed.data as Prisma.QuizResultUpdateInput,
    })
    return ok(result)
  } catch (error) {
    return handlePrismaError(error)
  }
}

// DELETE /api/quiz-results/:id
export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  const { id } = await params

  try {
    await prisma.quizResult.delete({ where: { id } })
    return ok(null, 'Quiz result deleted')
  } catch (error) {
    return handlePrismaError(error)
  }
}
