// app/tutors/[tutorId]/book/confirmation/page.tsx  →  /tutors/123/book/confirmation
//
// Final step of the booking flow. Your doc calls this out specifically as
// worth its own URL because a user might screenshot, refresh, or come back
// to this exact screen — unlike a modal or toast, which disappears.
//
// In the Figma Make prototype this screen needs `tutor + slot + form` all
// passed in from the previous screen's state. Once this is a real route,
// that data either needs to come from a query param / booking id
// (e.g. ?bookingId=abc) or be re-fetched by tutorId + a booking id.

import PageContainer from "@/components/layout/PageContainer";
import PlaceholderBlock from "@/components/layout/PlaceholderBlock";

type ConfirmationPageProps = {
  params: Promise<{ tutorId: string }>;
  searchParams: Promise<{ bookingId?: string }>;
};

export default async function BookingConfirmationPage({
  params,
  searchParams,
}: ConfirmationPageProps) {
  const { tutorId } = await params;
  const { bookingId } = await searchParams;

  return (
    <PageContainer width="narrow">
      <div className="rounded-2xl border border-[#DDD8CF] bg-white p-8 text-center">
        <p className="mb-2 font-mono text-xs uppercase tracking-[0.14em] text-[#1B4D3E]">
          Request sent
        </p>
        <h1 className="mb-4 font-serif text-2xl text-[#1A1714]">
          Your session request is on its way
        </h1>
        <p className="mx-auto max-w-sm text-sm leading-relaxed text-[#6B6560]">
          The tutor will reach out to confirm the time. Booking reference:{" "}
          {bookingId ?? "(pending)"} · Tutor: {tutorId}
        </p>
      </div>

      {/* Real component later: booking summary card (tutor, subject, slot) */}
      <div className="mt-8">
        <PlaceholderBlock label="Booking summary card" height="h-32" />
      </div>
    </PageContainer>
  );
}
