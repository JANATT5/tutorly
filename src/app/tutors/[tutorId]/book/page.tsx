// app/tutors/[tutorId]/book/page.tsx  →  /tutors/123/book
//
// Server component: looks the tutor up through the real API (same
// axiosGet + 404 pattern as ../page.tsx) and renders BookingForm — a
// client component — for the actual interactive slot-picker + form.

import Link from "next/link";
import { notFound } from "next/navigation";
import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/layout/PageHeader";
import BookingForm from "@/components/tutors/BookingForm";
import { axiosGet, ApiError } from "@/lib/axios";
import type { Tutor } from "@/hooks/useTutors";

type BookSessionPageProps = {
  params: Promise<{ tutorId: string }>;
};

export default async function BookSessionPage({ params }: BookSessionPageProps) {
  const { tutorId } = await params;

  let tutor: Tutor;
  try {
    const response = await axiosGet<Tutor>(`tutors/${tutorId}`);
    if (!response.data) notFound();
    tutor = response.data;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }

  return (
    <PageContainer width="narrow">
      <Link
        href={`/tutors/${tutor.id}`}
        className="mb-6 inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 text-sm text-body transition-colors hover:border-forest hover:text-forest"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 18l-6-6 6-6" />
        </svg>
        Back to {tutor.fullName}&apos;s profile
      </Link>

      <PageHeader
        eyebrow={`Booking with ${tutor.fullName}`}
        title="Book a session"
        description="Pick a time and we'll send your request straight to the tutor."
      />

      <BookingForm tutor={tutor} />
    </PageContainer>
  );
}
