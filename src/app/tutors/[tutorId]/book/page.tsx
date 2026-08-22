// app/tutors/[tutorId]/book/page.tsx  →  /tutors/123/book
//
// Server component: looks the tutor up by id (404s if missing) and
// renders BookingForm — a client component — for the actual
// interactive slot-picker + contact form.

import Link from "next/link";
import { notFound } from "next/navigation";
import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/layout/PageHeader";
import BookingForm from "@/components/tutors/BookingForm";
import { tutors } from "@/lib/mock-data";

type BookSessionPageProps = {
  params: Promise<{ tutorId: string }>;
};

export default async function BookSessionPage({ params }: BookSessionPageProps) {
  const { tutorId } = await params;

  const tutor = tutors.find((t) => t.id === tutorId);
  if (!tutor) notFound();

  return (
    <PageContainer width="narrow">
      <Link
        href={`/tutors/${tutor.id}`}
        className="mb-6 inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 text-sm text-body transition-colors hover:border-forest hover:text-forest"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 18l-6-6 6-6" />
        </svg>
        Back to {tutor.name}&apos;s profile
      </Link>

      <PageHeader
        eyebrow={`Booking with ${tutor.name}`}
        title="Book a session"
        description="No account needed — just pick a time and leave your contact info. The tutor will confirm directly."
      />

      <BookingForm tutor={tutor} />
    </PageContainer>
  );
}
