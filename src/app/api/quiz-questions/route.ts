import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ok, created, fail, handlePrismaError } from '@/lib/apiResponse'
import { quizQuestionSchema } from './schema'

// GET /api/quiz-questions — the full career-quiz question bank
export async function GET() {
  const questions = await prisma.quizQuestion.findMany()
  return ok(questions)
}

// POST /api/quiz-questions — add a question to the career quiz
export async function POST(request: NextRequest) {
  const body = await request.json()

  const parsed = quizQuestionSchema.safeParse(body)
  if (!parsed.success) {
    return fail(400, 'Invalid request', parsed.error.flatten())
  }

  try {
    const question = await prisma.quizQuestion.create({ data: parsed.data })
    return created(question)
  } catch (error) {
    return handlePrismaError(error)
  }
}
