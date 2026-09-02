// app/tutors/[tutorId]/page.tsx  →  /tutors/123, /tutors/456, etc.
//
// DYNAMIC ROUTE. The [tutorId] folder name (square brackets) tells
// Next.js "this segment of the URL is a variable, not a fixed word."
// Whatever the user actually visits — /tutors/cly8x... — gets captured
// and handed to this component as `params`.
//
// This page is still a Server Component (it's an `async function`, no
// "use client") for fast first paint / SEO on a public profile page — but
// it now fetches the real tutor through the same /api/tutors/:id route
// everything else uses, via the shared `axiosGet` helper (src/lib/axios.ts
// resolves an absolute URL automatically when called server-side — see
// buildUrl() in src/lib/baseUrl.ts). It's just called directly with
// `await` here instead of through a react-query hook, since hooks only
// work in Client Components.

import Link from "next/link";
import { notFound } from "next/navigation";
import PageContainer from "@/components/layout/PageContainer";
import TutorProfileTabs from "@/components/tutors/TutorProfileTabs";
import { curriculumLabel } from "@/components/tutors/TutorCard";
import { axiosGet, ApiError } from "@/lib/axios";
import type { Tutor } from "@/hooks/useTutors";

const fallbackAvatar =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96'%3E%3Crect width='96' height='96' fill='%23e5e7eb'/%3E%3C/svg%3E";

type TutorProfilePageProps = {
  params: Promise<{ tutorId: string }>;
};

export default async function TutorProfilePage({ params }: TutorProfilePageProps) {
  const { tutorId } = await params;

  let tutor: Tutor;
  try {
    const response = await axiosGet<Tutor>(`tutors/${tutorId}`);
    // `data` is typed optional on IResponse<T> (a failure response has no
    // data), but a 2xx/handled-status success always includes it here —
    // this guard just makes that explicit for TypeScript.
    if (!response.data) notFound();
    tutor = response.data;
  } catch (error) {
    // Our API always answers HTTP 200 with the real outcome embedded in the
    // body (see the big comment in src/lib/apiResponse.ts) — a "not found"
    // tutor comes back as an ApiError with status 404 here, which is
    // exactly Next.js's signal to render this route's not-found page.
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }

  const subjectNames = tutor.subjects.map((ts) => ts.subject.name);

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
          src={tutor.avatar ?? fallbackAvatar}
          alt={tutor.fullName}
          className="h-24 w-24 shrink-0 rounded-2xl object-cover"
        />

        <div className="flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="font-display text-2xl text-fg">{tutor.fullName}</h1>
              <p className="mt-1 text-sm text-subtle">
                {[tutor.location, tutor.languages.join(" · ")].filter(Boolean).join(" · ")}
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-fg">
                <span className="text-gold">★</span>
                <span className="font-medium">{tutor.rating ?? "New"}</span>
                <span className="text-subtle">· {tutor.sessions} sessions</span>
              </p>
            </div>

            <div className="text-right">
              <p className="text-lg font-semibold text-fg">${tutor.hourlyRate}</p>
              <p className="text-xs text-subtle">per hour</p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {subjectNames.map((name) => (
              <span
                key={name}
                className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-forest"
              >
                {name}
              </span>
            ))}
            <span className="rounded-full bg-amber/15 px-2.5 py-1 text-xs font-medium text-amber-hover">
              {curriculumLabel[tutor.curriculum]}
            </span>
          </div>
        </div>
      </div>

      {/* Tabbed sections — Info / Subjects / Bio / Availability.
          These are tabs on THIS page, not separate routes, per the sitemap. */}
      <TutorProfileTabs tutor={tutor} />

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
