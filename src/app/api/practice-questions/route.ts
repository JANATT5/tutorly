import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ok, created, fail, handlePrismaError } from '@/lib/apiResponse'
import { createPracticeQuestionSchema } from './schema'

// GET /api/practice-questions — list questions, optionally filtered by
// ?subjectId=<id> and/or ?difficulty=<text> (used when a student picks a
// subject/level and starts a practice test)
export async function GET(request: NextRequest) {
  const subjectId = request.nextUrl.searchParams.get('subjectId')
  const difficulty = request.nextUrl.searchParams.get('difficulty')

  const questions = await prisma.practiceQuestion.findMany({
    where: {
      ...(subjectId ? { subjectId } : {}),
      ...(difficulty ? { difficulty } : {}),
    },
  })

  return ok(questions)
}

// POST /api/practice-questions — add a question to the bank
export async function POST(request: NextRequest) {
  const body = await request.json()

  const parsed = createPracticeQuestionSchema.safeParse(body)
  if (!parsed.success) {
    return fail(400, 'Invalid request', parsed.error.flatten())
  }

  try {
    const question = await prisma.practiceQuestion.create({ data: parsed.data })
    return created(question)
  } catch (error) {
    // Most likely cause here: subjectId doesn't point to a real subject.
    return handlePrismaError(error)
  }
}
