// components/tutors/TutorCard.tsx

import Link from "next/link";
import type { Tutor } from "@/hooks/useTutors";

// Nicer display text for the 3 real curriculum values (see
// prisma/schema.prisma). Exported so browse/page.tsx's curriculum filter
// dropdown can reuse the exact same labels instead of redefining them.
export const curriculumLabel: Record<Tutor["curriculum"], string> = {
  LEBANESE: "Lebanese Bac",
  FRENCH: "French Bac",
  AMERICAN: "American / SAT",
};

// Used when a tutor hasn't uploaded a profile photo yet (`avatar` is
// nullable in the database).
const fallbackAvatar =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='56'%3E%3Crect width='56' height='56' fill='%23e5e7eb'/%3E%3C/svg%3E";

export default function TutorCard({ tutor }: { tutor: Tutor }) {
  // tutor.subjects is a list of TutorSubject join rows (see the `subjects:
  // { include: { subject: true } }` include in src/app/api/tutors/route.ts)
  // — the actual subject name lives one level down, at `.subject.name`.
  const subjectNames = tutor.subjects.map((ts) => ts.subject.name);

  return (
    <Link
      href={`/tutors/${tutor.id}`}
      className="block rounded-2xl border border-border bg-white p-5 transition-shadow hover:shadow-md">
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
            <p className="truncate text-xs text-subtle">
              {tutor.languages.length > 0 ? tutor.languages.join(" · ") : "Languages not listed"}
            </p>
          </div>
        </div>

        <div className="shrink-0 text-right">
          <p className="text-sm font-semibold text-fg">${tutor.hourlyRate}</p>
          <p className="text-xs text-subtle">per hour</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-1.5 text-xs text-subtle">
        <span className="text-gold">★</span>
        {/* rating is null until a tutor has their first review */}
        <span className="font-medium text-fg">{tutor.rating ?? "New"}</span>
        <span>·</span>
        <span>{tutor.sessions} sessions</span>
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
        <span className="rounded-full bg-amber/15 px-2.5 py-1 text-xs font-medium text-amber-hover">
          {curriculumLabel[tutor.curriculum]}
        </span>
      </div>
    </Link>
  );
}
