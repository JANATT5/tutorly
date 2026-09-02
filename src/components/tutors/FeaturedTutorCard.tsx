// components/tutors/FeaturedTutorCard.tsx
//
// The compact card used in Home's "Featured tutors" section. Distinct from
// TutorCard (used on /browse): this one shows years of experience instead
// of languages, and doesn't show curriculum. Kept as its own component
// rather than overloading TutorCard with a "variant" prop, since the two
// layouts diverge enough (different second line, no curriculum pill) that
// a shared component would need more conditional branches than it's worth.

import Link from "next/link";
import type { Tutor } from "@/hooks/useTutors";

const fallbackAvatar =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='56'%3E%3Crect width='56' height='56' fill='%23e5e7eb'/%3E%3C/svg%3E";

export default function FeaturedTutorCard({ tutor }: { tutor: Tutor }) {
  const subjectNames = tutor.subjects.map((ts) => ts.subject.name);

  return (
    <Link
      href={`/tutors/${tutor.id}`}
      className="block rounded-2xl border border-border bg-white p-5 transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={tutor.avatar ?? fallbackAvatar}
            alt={tutor.fullName}
            className="h-14 w-14 shrink-0 rounded-xl object-cover"
          />
          <div className="min-w-0">
            <p className="truncate font-display text-base text-fg">{tutor.fullName}</p>
            <p className="text-xs text-subtle">
              {tutor.experienceYears != null ? `${tutor.experienceYears} yrs exp.` : "New tutor"}
            </p>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-fg">
              <span className="text-gold">★</span>
              <span className="font-medium">{tutor.rating ?? "New"}</span>
              <span className="text-subtle">· {tutor.sessions} sessions</span>
            </p>
          </div>
        </div>

        <div className="shrink-0 text-right">
          <p className="text-sm font-semibold text-fg">${tutor.hourlyRate}/hr</p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {subjectNames.map((name) => (
          <span
            key={name}
            className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-forest"
          >
            {name}
          </span>
        ))}
      </div>

      <p className="mt-3 line-clamp-2 text-sm text-body">{tutor.bio}</p>
    </Link>
  );
}
