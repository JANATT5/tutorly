// components/tutors/TutorProfileTabs.tsx
//
// The Info/Subjects/Bio/Availability tabs on a tutor's profile page.
// Previously these were just static <span> labels with no click
// handlers or state — clicking "Availability" did nothing, and the
// content underneath was a permanent PlaceholderBlock regardless of
// which tab was "selected". This wires them to real local tab state
// (same pattern as DashboardTabs) and renders the tutorTopics /
// tutorAvailability data that already existed in lib/mock-data but
// was never actually used anywhere.

"use client";

import { useState } from "react";
import Link from "next/link";
import type { Tutor } from "@/lib/mock-data";

type TutorProfileTabsProps = {
  tutor: Tutor;
  topics: string[];
  availability: string[];
};

const tabs = ["Info", "Subjects", "Bio", "Availability"] as const;
type Tab = (typeof tabs)[number];

export default function TutorProfileTabs({ tutor, topics, availability }: TutorProfileTabsProps) {
  const [activeTab, setActiveTab] = useState<Tab>("Info");

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
            <Row label="Location" value={tutor.location} />
            <Row label="Curriculum" value={tutor.curriculum} />
            <Row label="Languages" value={tutor.languages.join(", ")} />
            <Row label="Experience" value={`${tutor.experienceYears} years`} />
          </div>
        )}

        {activeTab === "Subjects" && (
          <div>
            {topics.length === 0 ? (
              <p className="text-sm text-subtle">No specific topics listed yet.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {topics.map((topic) => (
                  <span
                    key={topic}
                    className="rounded-full bg-secondary px-3 py-1.5 text-sm font-medium text-forest"
                  >
                    {topic}
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
          <div>
            {availability.length === 0 ? (
              <p className="text-sm text-subtle">
                No open slots listed right now — request a time and {tutor.name} will confirm
                directly.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {availability.map((slot) => (
                  <div
                    key={slot}
                    className="flex items-center justify-between rounded-xl border border-border p-4"
                  >
                    <span className="text-sm font-medium text-fg">{slot}</span>
                    <Link
                      href={`/tutors/${tutor.id}/book`}
                      className="rounded-lg bg-forest px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-forest-dark"
                    >
                      Request
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
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