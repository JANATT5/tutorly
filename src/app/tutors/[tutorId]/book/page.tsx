// app/tutors/[tutorId]/book/page.tsx  →  /tutors/123/book
//
// A "regular route (nested)" per your doc: it's fixed word "book" nested
// under the dynamic [tutorId] segment. It still needs the tutorId (to know
// WHO the booking is for), so it inherits that from the same [tutorId]
// bracket folder one level up — that's why the params type looks identical
// to the profile page.

import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/layout/PageHeader";
import PlaceholderBlock from "@/components/layout/PlaceholderBlock";

type BookSessionPageProps = {
  params: Promise<{ tutorId: string }>;
};

export default async function BookSessionPage({ params }: BookSessionPageProps) {
  const { tutorId } = await params;

  return (
    <PageContainer width="narrow">
      <PageHeader
        eyebrow={`Booking with tutor ${tutorId}`}
        title="Book a session"
        description="No account needed — just pick a time and leave your contact info. The tutor will confirm directly."
      />

      {/* Real component later: available time slots for this tutor */}
      <div className="mb-6">
        <PlaceholderBlock label="Available time slots" height="h-24" />
      </div>

      {/* Real component later: contact form (name, email/phone, subject, notes).
          Remember: plain <button onClick> handlers here, not a native <form> tag,
          per the project's build conventions. */}
      <PlaceholderBlock label="Contact + booking details form" height="h-56" />
    </PageContainer>
  );
}
