// components/tutors/TutorProfileTabs.tsx
//
// The Info/Subjects/Bio/Availability tabs on a tutor's profile page.

"use client";

import { useState } from "react";
import type { Tutor } from "@/hooks/useTutors";
import { curriculumLabel } from "./TutorCard";

type TutorProfileTabsProps = {
  tutor: Tutor;
};

const tabs = ["Info", "Subjects", "Bio", "Availability"] as const;
type Tab = (typeof tabs)[number];

export default function TutorProfileTabs({ tutor }: TutorProfileTabsProps) {
  const [activeTab, setActiveTab] = useState<Tab>("Info");
  const subjectNames = tutor.subjects.map((ts) => ts.subject.name);

  return (
    <div>
      <div className="mt-8 flex gap-6 border-b border-border font-mono text-xs uppercase tracking-wide text-subtle">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            aria-current={activeTab === tab ? "page" : undefined}
            className={`pb-3 transition-colors ${
              activeTab === tab
                ? "border-b-2 border-forest text-forest"
                : "border-b-2 border-transparent hover:text-fg"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-xl border border-border bg-white p-6">
        {activeTab === "Info" && (
          <div className="space-y-1.5 text-sm">
            <Row label="Location" value={tutor.location ?? "Not specified"} />
            <Row label="Curriculum" value={curriculumLabel[tutor.curriculum]} />
            <Row
              label="Languages"
              value={tutor.languages.length > 0 ? tutor.languages.join(", ") : "Not specified"}
            />
            <Row
              label="Experience"
              value={tutor.experienceYears != null ? `${tutor.experienceYears} years` : "Not specified"}
            />
          </div>
        )}

        {activeTab === "Subjects" && (
          <div>
            {subjectNames.length === 0 ? (
              <p className="text-sm text-subtle">No subjects listed yet.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {subjectNames.map((name) => (
                  <span
                    key={name}
                    className="rounded-full bg-secondary px-3 py-1.5 text-sm font-medium text-forest"
                  >
                    {name}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "Bio" && (
          <p className="text-sm leading-relaxed text-body">{tutor.bio}</p>
        )}

        {activeTab === "Availability" && (
          // Availability scheduling doesn't have a backing model yet (no
          // Availability table in prisma/schema.prisma) — rather than fake
          // it, this is an honest "not built yet" state. See
          // docs/API_GUIDE.md for this as a flagged follow-up.
          <p className="text-sm text-subtle">
            {tutor.fullName} hasn&apos;t listed specific open slots yet — request a time and
            they&apos;ll confirm directly.
          </p>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-subtle">{label}</span>
      <span className="font-medium text-fg">{value}</span>
    </div>
  );
}
