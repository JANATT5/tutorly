import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Defines exactly what a valid POST body must look like
const createApplicationSchema = z.object({
  tutorId: z.string().min(1, 'tutorId is required'),
  documents: z.array(z.string()).optional().default([]),
  aiScore: z.number().min(0).max(100).optional().nullable(),
});

export async function POST(request: NextRequest) {
  const body = await request.json();

  // Validate before touching the database
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