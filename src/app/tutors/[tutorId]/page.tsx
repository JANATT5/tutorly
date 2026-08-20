// app/tutors/[tutorId]/page.tsx  →  /tutors/123, /tutors/456, etc.
//
// This is your first DYNAMIC ROUTE. The [tutorId] folder name (square
// brackets) tells Next.js "this segment of the URL is a variable, not a
// fixed word." Whatever the user actually visits — /tutors/42,
// /tutors/abc123 — gets captured and handed to this component as `params`.
//
// This is the important migration point flagged in your doc (section 6.3):
// the Figma Make prototype passes the WHOLE tutor object in memory. Here,
// we only ever receive the id string from the URL, so this page is
// responsible for fetching the full tutor by that id — which is exactly
// what makes the profile refreshable/shareable/bookmarkable.

import Link from "next/link";
import PageContainer from "@/components/layout/PageContainer";
import PlaceholderBlock from "@/components/layout/PlaceholderBlock";

type TutorProfilePageProps = {
  params: Promise<{ tutorId: string }>;
};

export default async function TutorProfilePage({ params }: TutorProfilePageProps) {
  const { tutorId } = await params;

  // TODO: replace with a real fetch once the API/DB exists, e.g.
  // const tutor = await getTutorById(tutorId);
  // if (!tutor) notFound();

  return (
    <PageContainer>
      <p className="mb-6 font-mono text-xs uppercase tracking-[0.14em] text-[#D47A2A]">
        Tutor profile · id: {tutorId}
      </p>

      {/* Real component later: tutor header — photo, name, subjects, rating */}
      <PlaceholderBlock label="Tutor header (photo, name, rate, subjects)" height="h-40" />

      {/* Real component later: tabbed sections — Info / Subjects / Bio / Availability.
          These are tabs on THIS page, not separate routes, per the sitemap. */}
      <div className="mt-8 flex gap-6 border-b border-[#DDD8CF] font-mono text-xs uppercase tracking-wide text-[#6B6560]">
        <span className="border-b-2 border-[#1B4D3E] pb-3 text-[#1B4D3E]">Info</span>
        <span className="pb-3">Subjects</span>
        <span className="pb-3">Bio</span>
        <span className="pb-3">Availability</span>
      </div>
      <div className="mt-6">
        <PlaceholderBlock label="Active tab content" height="h-48" />
      </div>

      <div className="mt-8">
        <Link
          href={`/tutors/${tutorId}/book`}
          className="inline-block rounded-lg bg-[#D47A2A] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#C06820]"
        >
          Book a session
        </Link>
      </div>
    </PageContainer>
  );
}
