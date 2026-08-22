// app/tutors/[tutorId]/page.tsx  →  /tutors/123, /tutors/456, etc.
//
// DYNAMIC ROUTE. The [tutorId] folder name (square brackets) tells
// Next.js "this segment of the URL is a variable, not a fixed word."
// Whatever the user actually visits — /tutors/lara-khoury,
// /tutors/omar-zreik — gets captured and handed to this component as
// `params`.
//
// This is the important migration point flagged in your doc (section
// 6.3): the Figma Make prototype passes the WHOLE tutor object in
// memory. Here, we only ever receive the id string from the URL, so
// this page looks the tutor up from lib/mock-data by that id — which
// is what makes the profile refreshable/shareable/bookmarkable.
// Swap the mock-data lookup for a real fetch once the API/DB exists.

import Link from "next/link";
import { notFound } from "next/navigation";
import PageContainer from "@/components/layout/PageContainer";
import PlaceholderBlock from "@/components/layout/PlaceholderBlock";
import { tutors, type SubjectKey } from "@/lib/mock-data";

const subjectLabel: Record<SubjectKey, string> = {
  mathematics: "Mathematics",
  physics: "Physics",
  chemistry: "Chemistry",
  biology: "Biology",
  "computer-science": "Computer Science",
};

type TutorProfilePageProps = {
  params: Promise<{ tutorId: string }>;
};

export default async function TutorProfilePage({ params }: TutorProfilePageProps) {
  const { tutorId } = await params;

  const tutor = tutors.find((t) => t.id === tutorId);
  if (!tutor) notFound();

  return (
    <PageContainer>
      <Link
        href="/browse"
        className="mb-6 inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 text-sm text-body transition-colors hover:border-forest hover:text-forest"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 18l-6-6 6-6" />
        </svg>
        Back to browse
      </Link>

      <p className="mb-6 font-mono text-xs uppercase tracking-[0.14em] text-[#D47A2A]">
        Tutor profile
      </p>

      {/* Tutor header — photo, name, rate, subjects */}
      <div className="flex flex-col gap-6 rounded-2xl border border-border bg-white p-6 sm:flex-row sm:items-start">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={tutor.avatar}
          alt={tutor.name}
          className="h-24 w-24 shrink-0 rounded-2xl object-cover"
        />

        <div className="flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="font-display text-2xl text-fg">{tutor.name}</h1>
              <p className="mt-1 text-sm text-subtle">
                {tutor.location} · {tutor.languages.join(" · ")}
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-fg">
                <span className="text-gold">★</span>
                <span className="font-medium">{tutor.rating}</span>
                <span className="text-subtle">· {tutor.sessions} sessions</span>
              </p>
            </div>

            <div className="text-right">
              <p className="text-lg font-semibold text-fg">${tutor.pricePerHour}</p>
              <p className="text-xs text-subtle">per hour</p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {tutor.subjects.map((s) => (
              <span
                key={s}
                className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-forest"
              >
                {subjectLabel[s]}
              </span>
            ))}
            <span className="rounded-full bg-amber/15 px-2.5 py-1 text-xs font-medium text-amber-hover">
              {tutor.curriculum}
            </span>
          </div>
        </div>
      </div>

      {/* Tabbed sections — Info / Subjects / Bio / Availability.
          These are tabs on THIS page, not separate routes, per the sitemap. */}
      <div className="mt-8 flex gap-6 border-b border-border font-mono text-xs uppercase tracking-wide text-subtle">
        <span className="border-b-2 border-forest pb-3 text-forest">Info</span>
        <span className="pb-3">Subjects</span>
        <span className="pb-3">Bio</span>
        <span className="pb-3">Availability</span>
      </div>

      <div className="mt-6 rounded-xl border border-border bg-white p-6">
        <p className="text-sm leading-relaxed text-body">{tutor.bio}</p>
      </div>

      {/* Real component later: Availability tab content (calendar/slots) */}
      <div className="mt-6">
        <PlaceholderBlock label="Availability tab (calendar / open slots)" height="h-32" />
      </div>

      <div className="mt-8">
        <Link
          href={`/tutors/${tutorId}/book`}
          className="inline-block rounded-lg bg-amber px-5 py-3 text-sm font-medium text-fg transition-colors hover:bg-amber-hover"
        >
          Book a session
        </Link>
      </div>
    </PageContainer>
  );
}
