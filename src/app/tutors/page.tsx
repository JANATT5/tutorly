// app/tutors/page.tsx  →  /tutors
//
// Regular route: fixed URL, but the CONTENT changes based on search/filter
// input. Per your doc, Search and Filter aren't their own routes — they're
// components on this page that read/write the URL's searchParams (e.g.
// /tutors?subject=math). That's why this page component below receives a
// `searchParams` prop: Next.js passes it in automatically for any page,
// populated from the current URL's query string.

import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/layout/PageHeader";
import PlaceholderBlock from "@/components/layout/PlaceholderBlock";

type TutorsPageProps = {
  // Next.js gives every route segment's query params here as strings
  // (or undefined if not present). `subject` matches a link like
  // /tutors?subject=biology sent from the homepage or the Career Quiz results.
  searchParams: Promise<{ subject?: string }>;
};

export default async function TutorsPage({ searchParams }: TutorsPageProps) {
  const { subject } = await searchParams;

  return (
    <PageContainer width="wide">
      <PageHeader
        eyebrow="Find tutors"
        title="Browse tutors"
        description={
          subject
            ? `Showing tutors for ${subject}. Clear the filter to see everyone.`
            : "Search by subject, or filter by grade level and availability."
        }
      />

      {/* Real component later: SearchTutors — text input, updates ?q= */}
      <div className="mb-6">
        <PlaceholderBlock label="Search input" height="h-14" />
      </div>

      {/* Real component later: FilterTutorsBySubject — chips/select, updates ?subject= */}
      <div className="mb-8">
        <PlaceholderBlock label="Subject filter chips" height="h-14" />
      </div>

      {/* Real component later: grid of <TutorCard /> — each card links to
          /tutors/[tutorId], never has its own URL itself */}
      <PlaceholderBlock label="Tutor results grid (TutorCard × N)" height="h-64" />
    </PageContainer>
  );
}
