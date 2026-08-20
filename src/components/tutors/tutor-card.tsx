// components/tutors/TutorCard.tsx

import Link from "next/link";
import type { Tutor, SubjectKey } from "@/lib/mock-data";

const subjectLabel: Record<SubjectKey, string> = {
  mathematics: "Mathematics",
  physics: "Physics",
  chemistry: "Chemistry",
  biology: "Biology",
  "computer-science": "Computer Science",
};

export default function TutorCard({ tutor }: { tutor: Tutor }) {
  return (
    <Link
      href={`/tutors/${tutor.id}`}
      className="block rounded-2xl border border-[#DDD8CF] bg-white p-5 transition-shadow hover:shadow-md">
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
            <p className="text-xs text-subtle">{tutor.languages.join(" · ")}</p>
          </div>
        </div>

        <div className="shrink-0 text-right">
          <p className="text-sm font-semibold text-fg">${tutor.pricePerHour}</p>
          <p className="text-xs text-subtle">per hour</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-1.5 text-xs text-subtle">
        <span className="text-gold">★</span>
        <span className="font-medium text-fg">{tutor.rating}</span>
        <span>·</span>
        <span>{tutor.sessions} sessions</span>
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
        <span className="rounded-full bg-amber/15 px-2.5 py-1 text-xs font-medium text-amber-hover">
          {tutor.curriculum}
        </span>
      </div>
    </Link>
  );
}