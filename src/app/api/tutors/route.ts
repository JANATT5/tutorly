
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/tutors — list tutors, optionally filtered by subject
export async function GET(request: NextRequest) {
  const subject = request.nextUrl.searchParams.get('subject');

  const tutors = await prisma.tutorProfile.findMany({
    where: subject
      ? { subjects: { some: { subject: { name: subject } } } }
      : undefined,
    include: {
      subjects: { include: { subject: true } },
      reviews: true,
    },
  });

  return NextResponse.json(tutors);
}

// POST /api/tutors — create a tutor profile (used after signup/onboarding)
export async function POST(request: NextRequest) {
  const body = await request.json();

  const tutor = await prisma.tutorProfile.create({
    data: {
      userId: body.userId,
      fullName: body.fullName,
      bio: body.bio,
      curriculum: body.curriculum,
      hourlyRate: body.hourlyRate,
    },
  });

  return NextResponse.json(tutor, { status: 201 });
}