import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ok, created, fail, handlePrismaError } from '@/lib/apiResponse'
import { createReviewSchema } from './schema'

// GET /api/reviews — list reviews, optionally filtered by ?tutorId=<id>
// (used on a tutor's profile page to show all their reviews)
export async function GET(request: NextRequest) {
  const tutorId = request.nextUrl.searchParams.get('tutorId')

  const reviews = await prisma.review.findMany({
    where: tutorId ? { tutorId } : undefined,
    orderBy: { createdAt: 'desc' },
  })

  return ok(reviews)
}

// POST /api/reviews — leave a review for a tutor
export async function POST(request: NextRequest) {
  const body = await request.json()

  const parsed = createReviewSchema.safeParse(body)
  if (!parsed.success) {
    return fail(400, 'Invalid request', parsed.error.flatten())
  }

  try {
    const review = await prisma.review.create({ data: parsed.data })
    return created(review)
  } catch (error) {
    // Most likely cause here: tutorId doesn't point to a real tutor.
    return handlePrismaError(error)
  }
}
