import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/applications — admin dashboard: list applications, optionally by status
export async function GET(request: NextRequest) {
  const status = request.nextUrl.searchParams.get('status');

  const applications = await prisma.tutorApplication.findMany({
    where: status ? { status: status as any } : undefined,
    include: { tutor: true },
    orderBy: { submittedAt: 'desc' },
  });

  return NextResponse.json(applications);
}

// POST /api/applications — submit a become-a-tutor application
export async function POST(request: NextRequest) {
  const body = await request.json();

  const application = await prisma.tutorApplication.create({
    data: {
      tutorId: body.tutorId,
      documents: body.documents ?? [],
      aiScore: body.aiScore ?? null,
    },
  });

  return NextResponse.json(application, { status: 201 });
}