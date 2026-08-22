// app/tutors/[tutorId]/book/confirmation/page.tsx  →  /tutors/123/book/confirmation
//
// Final step of the booking flow, worth its own URL because a user
// might screenshot, refresh, or come back to this exact screen —
// unlike a modal or toast, which disappears. Since there's no backend
// yet, the chosen subject/day/time travel here as query params from
// BookingForm rather than being looked up from a stored booking —
// enough to show a real summary without pretending there's a database.

import Link from "next/link";
import { notFound } from "next/navigation";
import PageContainer from "@/components/layout/PageContainer";
import { tutors, type SubjectKey } from "@/lib/mock-data";

const subjectLabel: Record<SubjectKey, string> = {
  mathematics: "Mathematics",
  physics: "Physics",
  chemistry: "Chemistry",
  biology: "Biology",
  "computer-science": "Computer Science",
};

type ConfirmationPageProps = {
  params: Promise<{ tutorId: string }>;
  searchParams: Promise<{ bookingId?: string; subject?: string; day?: string; time?: string }>;
};

export default async function BookingConfirmationPage({
  params,
  searchParams,
}: ConfirmationPageProps) {
  const { tutorId } = await params;
  const { bookingId, subject, day, time } = await searchParams;

  const tutor = tutors.find((t) => t.id === tutorId);
  if (!tutor) notFound();

  const subjectKey = subject as SubjectKey | undefined;

  return (
    <PageContainer width="narrow">
      <div className="rounded-2xl border border-border bg-white p-8 text-center">
        <p className="mb-2 font-mono text-xs uppercase tracking-[0.14em] text-forest">
          Request sent
        </p>
        <h1 className="mb-4 font-display text-2xl text-fg">
          Your session request is on its way
        </h1>
        <p className="mx-auto max-w-sm text-sm leading-relaxed text-subtle">
          {tutor.name} will reach out to confirm the time.
          {bookingId && <> Booking reference: {bookingId}.</>}
        </p>
      </div>

      {/* Booking summary card */}
      <div className="mt-8 rounded-2xl border border-border bg-white p-6">
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={tutor.avatar}
            alt={tutor.name}
            className="h-12 w-12 rounded-xl object-cover"
          />
          <div>
            <p className="font-display text-base text-fg">{tutor.name}</p>
            <p className="text-xs text-subtle">${tutor.pricePerHour}/hr</p>
          </div>
        </div>

        <div className="mt-4 space-y-1.5 border-t border-border pt-4 text-sm">
          <div className="flex justify-between">
            <span className="text-subtle">Subject</span>
            <span className="font-medium text-fg">
              {subjectKey ? subjectLabel[subjectKey] : "—"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-subtle">Day</span>
            <span className="font-medium text-fg">{day ?? "—"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-subtle">Time</span>
            <span className="font-medium text-fg">{time ?? "—"}</span>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="rounded-lg bg-forest px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-forest-dark"
        >
          Back to home
        </Link>
        <Link
          href="/browse"
          className="rounded-lg border border-border bg-white px-6 py-3 text-sm font-medium text-fg transition-colors hover:border-forest"
        >
          Browse more tutors
        </Link>
      </div>
    </PageContainer>
  );
}
