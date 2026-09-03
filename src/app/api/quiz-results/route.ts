import { NextRequest } from 'next/server'
import type { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { ok, created, fail, handlePrismaError } from '@/lib/apiResponse'
import { createQuizResultSchema } from '../schemas/quiz-results.schema'

// GET /api/quiz-results — list quiz attempts, optionally filtered by
// ?studentId=<id> (a student's own quiz history)
export async function GET(request: NextRequest) {
  const studentId = request.nextUrl.searchParams.get('studentId')

  const results = await prisma.quizResult.findMany({
    where: studentId ? { studentId } : undefined,
    orderBy: { createdAt: 'desc' },
  })

  return ok(results)
}

// POST /api/quiz-results — save a completed career-quiz attempt
export async function POST(request: NextRequest) {
  const body = await request.json()

  const parsed = createQuizResultSchema.safeParse(body)
  if (!parsed.success) {
    return fail(400, 'Invalid request', parsed.error.flatten())
  }

  try {
    const result = await prisma.quizResult.create({
      // `answers` came through zod as `unknown`, but we already know it's
      // valid JSON (it was parsed from a JSON request body) — Prisma's Json
      // columns just need that asserted for TypeScript.
      data: parsed.data as Prisma.QuizResultCreateInput,
    })
    return created(result)
  } catch (error) {
    return handlePrismaError(error)
  }
}
