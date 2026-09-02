import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ok, fail, handlePrismaError } from '@/lib/apiResponse'
import { reviewEditSchema } from '../schema'

type RouteContext = { params: Promise<{ id: string }> }

// GET /api/reviews/:id
export async function GET(_request: NextRequest, { params }: RouteContext) {
  const { id } = await params

  const review = await prisma.review.findUnique({ where: { id } })

  if (!review) return fail(404, 'Review not found')
  return ok(review)
}

// PUT /api/reviews/:id — full replace of rating/comment
export async function PUT(request: NextRequest, { params }: RouteContext) {
  const { id } = await params
  const body = await request.json()

  const parsed = reviewEditSchema.safeParse(body)
  if (!parsed.success) {
    return fail(400, 'Invalid request', parsed.error.flatten())
  }

  try {
    const review = await prisma.review.update({ where: { id }, data: parsed.data })
    return ok(review)
  } catch (error) {
    return handlePrismaError(error)
  }
}

// PATCH /api/reviews/:id — partial update
export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const { id } = await params
  const body = await request.json()

  const parsed = reviewEditSchema.partial().safeParse(body)
  if (!parsed.success) {
    return fail(400, 'Invalid request', parsed.error.flatten())
  }

  try {
    const review = await prisma.review.update({ where: { id }, data: parsed.data })
    return ok(review)
  } catch (error) {
    return handlePrismaError(error)
  }
}

// DELETE /api/reviews/:id
export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  const { id } = await params

  try {
    await prisma.review.delete({ where: { id } })
    return ok(null, 'Review deleted')
  } catch (error) {
    return handlePrismaError(error)
  }
}
