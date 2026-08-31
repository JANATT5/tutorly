import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validates optional ?status= query param
const statusQuerySchema = z.enum(['PENDING', 'APPROVED', 'REJECTED']).optional();

// Validates the POST body
const createApplicationSchema = z.object({
  tutorId: z.string().min(1, 'tutorId is required'),
  documents: z.array(z.string()).optional().default([]),
  aiScore: z.number().min(0).max(100).optional().nullable(),
});

// GET /api/applications — admin dashboard: list applications, optionally by status
export async function GET(request: NextRequest) {
  const rawStatus = request.nextUrl.searchParams.get('status');

  const parsedStatus = statusQuerySchema.safeParse(rawStatus ?? undefined);

  if (!parsedStatus.success) {
    return NextResponse.json(
      { error: 'Invalid status filter', details: parsedStatus.error.flatten() },
      { status: 400 }
    );
  }

  const applications = await prisma.tutorApplication.findMany({
    where: parsedStatus.data ? { status: parsedStatus.data } : undefined,
    include: { tutor: true },
    orderBy: { submittedAt: 'desc' },
  });

  return NextResponse.json(applications);
}

// POST /api/applications — submit a become-a-tutor application
export async function POST(request: NextRequest) {
  const body = await request.json();

  const parsed = createApplicationSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid request', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const application = await prisma.tutorApplication.create({
    data: {
      tutorId: parsed.data.tutorId,
      documents: parsed.data.documents,
      aiScore: parsed.data.aiScore ?? null,
    },
  });

  return NextResponse.json(application, { status: 201 });
}