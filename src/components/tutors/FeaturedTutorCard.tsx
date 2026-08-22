// components/tutors/FeaturedTutorCard.tsx
//
// The compact card used in Home's "Featured tutors — Recently joined"
// section. Distinct from TutorCard (used on /browse): this one shows
// years of experience instead of languages, and doesn't show curriculum.
// Kept as its own component rather than overloading TutorCard with a
// "variant" prop, since the two layouts diverge enough (different
// second line, no curriculum pill) that a shared component would need
// more conditional branches than it's worth.

import Link from "next/link";
import type { Tutor, SubjectKey } from "@/lib/mock-data";

const subjectLabel: Record<SubjectKey, string> = {
  mathematics: "Mathematics",
  physics: "Physics",
  chemistry: "Chemistry",
  biology: "Biology",
  "computer-science": "Computer Science",
};

export default function FeaturedTutorCard({ tutor }: { tutor: Tutor }) {
  return (
    <Link
      href={`/tutors/${tutor.id}`}
      className="block rounded-2xl border border-border bg-white p-5 transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={tutor.avatar}
            alt={tutor.name}
            className="h-14 w-14 rounded-xl object-cover"
          />
          <div>
            <p className="font-display text-base text-fg">{tutor.name}</p>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-fg">
              <span className="text-gold">★</span>
              <span className="font-medium">{tutor.rating}</span>
              <span className="text-subtle">· {tutor.sessions} sessions</span>
            </p>
          </div>
        </div>

        <div className="shrink-0 text-right">
          <p className="text-sm font-semibold text-fg">${tutor.pricePerHour}/hr</p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {tutor.subjects.map((s) => (
          <span
            key={s}
            className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-forest"
          >
            {subjectLabel[s]}
          </span>
        ))}
      </div>

      <p className="mt-3 line-clamp-2 text-sm text-body">{tutor.bio}</p>
    </Link>
  );
}